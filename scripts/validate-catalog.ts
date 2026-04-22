import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { SERVICE_CATALOG } from '../src/lib/services/catalog';
import { detectCycles } from '../src/lib/services/dependencies';
import type { ServiceItem, BilingualString, Price } from '../src/lib/services/types';

let errors: string[] = [];

function error(msg: string) {
	errors.push(msg);
	console.error(`❌ ${msg}`);
}

function validateBilingualString(bs: BilingualString, context: string) {
	if (!bs.en || bs.en.trim().length === 0) {
		error(`${context}: missing or empty 'en' string`);
	}
	if (!bs['pt-BR'] || bs['pt-BR'].trim().length === 0) {
		error(`${context}: missing or empty 'pt-BR' string`);
	}
}

function validatePrice(price: Price, context: string) {
	if (typeof price.BRL !== 'number' || price.BRL < 0) {
		error(`${context}: BRL must be a non-negative number, got ${price.BRL}`);
	}
	if (typeof price.USD !== 'number' || price.USD < 0) {
		error(`${context}: USD must be a non-negative number, got ${price.USD}`);
	}
}

// --- Check 1: Unique IDs ---
function checkUniqueIds() {
	const serviceIds = new Set<string>();
	for (const service of SERVICE_CATALOG) {
		if (serviceIds.has(service.id)) {
			error(`Duplicate service ID: "${service.id}"`);
		}
		serviceIds.add(service.id);

		// Configuration IDs unique per service
		const configIds = new Set<string>();
		if (service.configurations) {
			for (const config of service.configurations) {
				if (configIds.has(config.id)) {
					error(`Duplicate configuration ID "${config.id}" in service "${service.id}"`);
				}
				configIds.add(config.id);

				// Option IDs unique per configuration
				const optionIds = new Set<string>();
				for (const option of config.options) {
					if (optionIds.has(option.id)) {
						error(`Duplicate option ID "${option.id}" in config "${config.id}" of service "${service.id}"`);
					}
					optionIds.add(option.id);
				}
			}
		}

		// Custom field IDs unique per service
		const fieldIds = new Set<string>();
		if (service.customFields) {
			for (const field of service.customFields) {
				if (fieldIds.has(field.id)) {
					error(`Duplicate custom field ID "${field.id}" in service "${service.id}"`);
				}
				fieldIds.add(field.id);
			}
		}
	}
}

// --- Check 2: Reference integrity ---
function checkReferenceIntegrity() {
	const allServiceIds = new Set(SERVICE_CATALOG.map((s) => s.id));

	for (const service of SERVICE_CATALOG) {
		const refs = [
			...(service.requires || []),
			...(service.recommends || []),
			...(service.conflictsWith || []),
		];

		for (const ref of refs) {
			if (!allServiceIds.has(ref)) {
				error(`Service "${service.id}" references unknown service "${ref}"`);
			}
			if (ref === service.id) {
				error(`Service "${service.id}" lists itself in requires/recommends/conflictsWith`);
			}
		}

		// defaultOptionId exists in configuration options
		if (service.configurations) {
			for (const config of service.configurations) {
				if (config.defaultOptionId) {
					if (!config.options.find((o) => o.id === config.defaultOptionId)) {
						error(`Config "${config.id}" in service "${service.id}" has defaultOptionId "${config.defaultOptionId}" that doesn't exist in options`);
					}
				}
			}

			// additionalRequires reference valid service IDs
			for (const config of service.configurations) {
				for (const option of config.options) {
					if (option.additionalRequires) {
						for (const depId of option.additionalRequires) {
							if (!allServiceIds.has(depId)) {
								error(`Option "${option.id}" in config "${config.id}" of service "${service.id}" references unknown service "${depId}" in additionalRequires`);
							}
						}
					}
				}
			}
		}
	}
}

// --- Check 3: Dependency cycles ---
function checkCycles() {
	const cycles = detectCycles(SERVICE_CATALOG);
	for (const cycle of cycles) {
		error(`Dependency cycle detected: ${cycle.join(' → ')}`);
	}
}

// --- Check 4: Conflict symmetry ---
function checkConflictSymmetry() {
	for (const service of SERVICE_CATALOG) {
		if (!service.conflictsWith) continue;
		for (const conflictId of service.conflictsWith) {
			const other = SERVICE_CATALOG.find((s) => s.id === conflictId);
			if (!other) continue;
			if (!other.conflictsWith?.includes(service.id)) {
				error(`Asymmetric conflict: "${service.id}" conflictsWith "${conflictId}" but not vice versa`);
			}
		}
	}
}

// --- Check 5: Price sanity ---
function checkPrices() {
	for (const service of SERVICE_CATALOG) {
		validatePrice(service.basePrice, `Service "${service.id}" basePrice`);

		if (service.maintenance) {
			validatePrice(service.maintenance.price, `Service "${service.id}" maintenance.price`);
		}

		if (service.configurations) {
			for (const config of service.configurations) {
				for (const option of config.options) {
					validatePrice(option.priceModifier, `Service "${service.id}" > config "${config.id}" > option "${option.id}" priceModifier`);
					if (option.maintenanceModifier) {
						validatePrice(option.maintenanceModifier, `Service "${service.id}" > config "${config.id}" > option "${option.id}" maintenanceModifier`);
					}
				}
			}
		}

		if (service.thirdPartyCosts) {
			for (const cost of service.thirdPartyCosts) {
				validatePrice(cost.amount, `Service "${service.id}" > third-party cost "${cost.id}" amount`);
				if (cost.amountMax) {
					validatePrice(cost.amountMax, `Service "${service.id}" > third-party cost "${cost.id}" amountMax`);
				}
			}
		}
	}
}

// --- Check 6: Bilingual completeness ---
function checkBilingualStrings() {
	for (const service of SERVICE_CATALOG) {
		const ctx = `Service "${service.id}"`;
		validateBilingualString(service.name, `${ctx} name`);
		validateBilingualString(service.shortDescription, `${ctx} shortDescription`);
		validateBilingualString(service.longDescription, `${ctx} longDescription`);

		if (service.maintenance?.scope) {
			validateBilingualString(service.maintenance.scope, `${ctx} maintenance.scope`);
		}

		if (service.configurations) {
			for (const config of service.configurations) {
				validateBilingualString(config.label, `${ctx} > config "${config.id}" label`);
				if (config.description) {
					validateBilingualString(config.description, `${ctx} > config "${config.id}" description`);
				}
				for (const option of config.options) {
					validateBilingualString(option.label, `${ctx} > config "${config.id}" > option "${option.id}" label`);
					if (option.description) {
						validateBilingualString(option.description, `${ctx} > config "${config.id}" > option "${option.id}" description`);
					}
					if (option.additionalDeliverables) {
						for (const d of option.additionalDeliverables) {
							validateBilingualString(d.label, `${ctx} > config "${config.id}" > option "${option.id}" > deliverable "${d.id}" label`);
							if (d.description) {
								validateBilingualString(d.description, `${ctx} > config "${config.id}" > option "${option.id}" > deliverable "${d.id}" description`);
							}
						}
					}
				}
			}
		}

		if (service.customFields) {
			for (const field of service.customFields) {
				validateBilingualString(field.label, `${ctx} > field "${field.id}" label`);
				if (field.placeholder) {
					validateBilingualString(field.placeholder, `${ctx} > field "${field.id}" placeholder`);
				}
				if (field.helpText) {
					validateBilingualString(field.helpText, `${ctx} > field "${field.id}" helpText`);
				}
			}
		}

		for (const d of service.clientDeliverables) {
			validateBilingualString(d.label, `${ctx} > deliverable "${d.id}" label`);
			if (d.description) {
				validateBilingualString(d.description, `${ctx} > deliverable "${d.id}" description`);
			}
		}

		if (service.thirdPartyCosts) {
			for (const cost of service.thirdPartyCosts) {
				validateBilingualString(cost.label, `${ctx} > third-party cost "${cost.id}" label`);
				if (cost.note) {
					validateBilingualString(cost.note, `${ctx} > third-party cost "${cost.id}" note`);
				}
			}
		}
	}
}

// --- Check 7: Active config validity ---
function checkActiveConfigValidity() {
	for (const service of SERVICE_CATALOG) {
		if (!service.configurations) continue;
		for (const config of service.configurations) {
			if (config.required && config.type === 'single-select' && !config.defaultOptionId) {
				error(`Service "${service.id}" > required single-select config "${config.id}" has no defaultOptionId`);
			}
		}
	}
}

// --- Check 8: Custom field sanity ---
function checkCustomFieldSanity() {
	for (const service of SERVICE_CATALOG) {
		if (!service.customFields) continue;
		for (const field of service.customFields) {
			if (field.repeatable && field.minItems !== undefined && field.maxItems !== undefined) {
				if (field.minItems > field.maxItems) {
					error(`Service "${service.id}" > field "${field.id}": minItems (${field.minItems}) > maxItems (${field.maxItems})`);
				}
			}
		}
	}
}

// --- Check 9: Studio Control Panel bundling guard ---
function checkStudioControlPanelExists() {
	const panel = SERVICE_CATALOG.find((s) => s.id === 'studio-control-panel');
	if (!panel) {
		error('studio-control-panel service not found — bundling logic relies on this ID');
	} else if (panel.basePrice.BRL === 0 && panel.basePrice.USD === 0) {
		error('studio-control-panel has zero base price; bundle discount would be a no-op');
	}
}

// --- Check 10: Deliverable structure (id, type, required) ---
function checkDeliverableStructure() {
	const validTypes = ['domain', 'account-access', 'payment-method', 'credentials', 'decision', 'other'];

	function validateDeliverable(d: { id?: string; type?: string; required?: boolean }, ctx: string) {
		if (typeof d.id !== 'string' || d.id.length === 0) {
			error(`${ctx}: deliverable missing or empty id`);
		}
		if (!validTypes.includes(d.type as string)) {
			error(`${ctx}: deliverable "${d.id}" has invalid type "${d.type}"`);
		}
		if (typeof d.required !== 'boolean') {
			error(`${ctx}: deliverable "${d.id}" missing required field (must be boolean)`);
		}
	}

	for (const service of SERVICE_CATALOG) {
		const ctx = `[${service.id}]`;
		for (const d of service.clientDeliverables) {
			validateDeliverable(d, `${ctx} clientDeliverables`);
		}
		if (service.configurations) {
			for (const config of service.configurations) {
				for (const option of config.options) {
					if (option.additionalDeliverables) {
						for (const d of option.additionalDeliverables) {
							validateDeliverable(
								d,
								`${ctx} config "${config.id}" > option "${option.id}" additionalDeliverables`
							);
						}
					}
				}
			}
		}
	}
}

// --- Generate catalog version hash ---
function generateCatalogVersion(): string {
	const serialized = JSON.stringify(SERVICE_CATALOG);
	const hash = crypto.createHash('sha256').update(serialized).digest('hex');
	return hash.slice(0, 12);
}

// --- Main ---
console.log('🔍 Validating service catalog...\n');
console.log(`Found ${SERVICE_CATALOG.length} services.\n`);

// Write placeholder immediately so the file is never stale if a build fails mid-run
const generatedFilePath = path.resolve(__dirname, '../src/lib/services/catalog-version.generated.ts');
const placeholderContent = `// This file is auto-generated by scripts/validate-catalog.ts. Do not edit manually.\nexport const CATALOG_VERSION = 'pending';\n`;
fs.writeFileSync(generatedFilePath, placeholderContent, 'utf-8');

checkUniqueIds();
checkReferenceIntegrity();
checkCycles();
checkConflictSymmetry();
checkPrices();
checkBilingualStrings();
checkActiveConfigValidity();
checkCustomFieldSanity();
checkStudioControlPanelExists();
checkDeliverableStructure();

if (errors.length > 0) {
	console.error(`\n💀 Catalog validation failed with ${errors.length} error(s).`);
	process.exit(1);
}

// All checks passed — generate catalog version
const version = generateCatalogVersion();
console.log(`\n✅ Catalog validation passed. Version: ${version}`);

const versionContent = `// This file is auto-generated by scripts/validate-catalog.ts. Do not edit manually.\nexport const CATALOG_VERSION = '${version}';\n`;
fs.writeFileSync(generatedFilePath, versionContent, 'utf-8');
console.log(`📝 Wrote catalog version to ${path.relative(process.cwd(), generatedFilePath)}`);
