# Jobs System Documentation

## Overview
The jobs system allows you to easily manage job listings on the About Us page. Each job has its own collapsible card on the About page and a dedicated detail page with full information.

## File Structure
```
src/
├── lib/
│   └── jobs.ts                    # Jobs database and helper functions
├── components/
│   └── JobListing.tsx             # Collapsible job card component
└── app/
    └── [locale]/
        ├── about/
        │   └── page.tsx           # About page with jobs section
        └── jobs/
            └── [id]/
                └── page.tsx       # Individual job detail pages
```

## Adding a New Job

1. Open `src/lib/jobs.ts`
2. Add a new entry to the `jobsDatabase` array:

```typescript
{
    id: 'your-job-id',              // Unique identifier (used in URL)
    title: {
        en: 'Job Title in English',
        'pt-BR': 'Título do Trabalho em Português'
    },
    description: {
        en: 'Short description in English',
        'pt-BR': 'Descrição curta em português'
    },
    responsibilities: {
        en: [
            'Responsibility 1',
            'Responsibility 2'
        ],
        'pt-BR': [
            'Responsabilidade 1',
            'Responsabilidade 2'
        ]
    },
    requirements: {
        en: [
            'Requirement 1',
            'Requirement 2'
        ],
        'pt-BR': [
            'Requisito 1',
            'Requisito 2'
        ]
    },
    niceToHaves: {
        en: [
            'Nice to have 1',
            'Nice to have 2'
        ],
        'pt-BR': [
            'Diferencial 1',
            'Diferencial 2'
        ]
    },
    applyLink: 'mailto:jobs@madeinbugs.com.br?subject=Job Application',
    active: true,                    // Set to false to hide the job
    department: 'Engineering',       // Optional
    location: {
        en: 'Remote (Brazil)',
        'pt-BR': 'Remoto (Brasil)'
    },
    type: 'full-time',              // 'full-time', 'part-time', 'contract', 'internship'
    postedDate: '2025-01-15'        // Optional
}
```

## Job Properties

### Required Fields
- `id`: Unique identifier used in the URL (e.g., `/jobs/unity-developer`)
- `title`: Job title in both languages
- `description`: Brief description shown on the About page
- `responsibilities`: List of job responsibilities
- `requirements`: List of required qualifications
- `niceToHaves`: List of bonus qualifications
- `applyLink`: URL for the application (can be mailto: link or external form)

### Optional Fields
- `active`: Boolean to show/hide the job (default: true)
- `department`: Department name (e.g., 'Engineering', 'Design', 'Art')
- `location`: Work location in both languages
- `type`: Employment type ('full-time', 'part-time', 'contract', 'internship')
- `postedDate`: Date the job was posted (format: 'YYYY-MM-DD')

## Features

### About Us Page
- Jobs appear in a "Come Work With Us" section at the bottom of the About page
- Each job is a collapsible card showing:
  - Job title
  - Department badge
  - Employment type badge
  - Location badge
  - Short description (when expanded)
  - "Learn More" button

### Job Detail Pages
Each job has its own page at `/[locale]/jobs/[id]` with:
- Full job description
- Complete list of responsibilities
- All requirements
- Nice-to-have qualifications
- "Apply Now" button

## URLs
- English: `https://www.madeinbugs.com.br/en/jobs/unity-developer`
- Portuguese: `https://www.madeinbugs.com.br/pt-BR/jobs/unity-developer`

## Helper Functions

Available in `src/lib/jobs.ts`:

```typescript
getJobById(id: string)                    // Get a specific job by ID
getActiveJobs()                           // Get all active jobs
getJobsByDepartment(department: string)   // Get jobs by department
getAllJobs()                              // Get all jobs (including inactive)
getLocalizedJob(job, locale)              // Get localized job data
```

## Hiding/Removing Jobs

To hide a job without deleting it:
```typescript
{
    id: 'old-job',
    active: false,  // Job won't appear on the site
    // ... rest of the job data
}
```

To remove a job completely, simply delete its entry from the `jobsDatabase` array.

## Styling

Jobs use the same design system as the rest of the site:
- Purple theme (`purple-600`) for buttons and highlights
- Content cards with shadows and hover effects
- Responsive design for mobile and desktop
- Smooth animations for collapsible sections

## Examples

The system comes with two example jobs:
1. Unity Developer
2. Game Designer

You can use these as templates for creating new job listings.
