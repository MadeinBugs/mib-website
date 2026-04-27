import 'react';

declare module 'react' {
	namespace JSX {
		interface IntrinsicElements {
			'lite-youtube': React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement> & {
					videoid: string;
					playlabel?: string;
				},
				HTMLElement
			>;
		}
	}
}
