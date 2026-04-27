import {
	FaInstagram,
	FaYoutube,
	FaDiscord,
	FaEnvelope,
	FaGlobe,
	FaGamepad,
	FaCameraRetro,
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { SiTiktok, SiBluesky } from 'react-icons/si';
import type { IconType } from 'react-icons';
import type { IconName } from './types';

export const iconMap: Record<IconName, IconType> = {
	instagram: FaInstagram,
	youtube: FaYoutube,
	discord: FaDiscord,
	tiktok: SiTiktok,
	bluesky: SiBluesky,
	x: FaXTwitter,
	newsletter: FaEnvelope,
	mail: FaEnvelope,
	globe: FaGlobe,
	gamepad: FaGamepad,
	camera: FaCameraRetro,
};
