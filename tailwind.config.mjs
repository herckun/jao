/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		colors: {
		  black: colors.black,
		  white: colors.white,
		  gray: colors.slate,
		  green: colors.emerald,
		  purple: colors.violet,
		  yellow: colors.amber,
		  pink: colors.fuchsia,
		  red: colors.red,
		  'zinc': {
			'50': '#fafafa',
			'100': '#f4f4f5',
			'200': '#e4e4e7',
			'300': '#d4d4d8',
			'400': '#a1a1aa',
			'500': '#71717a',
			'600': '#52525b',
			'700': '#3f3f46',
			'800': '#27272a',
			'850':"27272A",
			'900': '#18181b',
			'950': '#09090b',
		  },
	
		  'affair': {
			'50': '#f1f8f1',
			'100': '#deeedd',
			'200': '#bedcbe',
			'300': '#92c396',
			'400': '#63a469',
			'500': '#42874b',
			'600': '#306b3a',
			'700': '#26562f',
			'800': '#204526',
			'900': '#1b3921',
			'950': '#0b180e',
		  },
		  'candlelight': {
			'50': '#fefde8',
			'100': '#fdfac4',
			'200': '#fcf18c',
			'300': '#f9e24b',
			'400': '#f6d32d',
			'500': '#e5b70d',
			'600': '#c68e08',
			'700': '#9e650a',
			'800': '#825011',
			'900': '#6f4114',
			'950': '#412207',
		},
		
	
		  transparent: 'transparent',
		  current: 'currentColor',
		  'white': '#ffffff',
		  'purple': '#3f3cbb',
		  'midnight': '#121063',
		  'metal': '#565584',
		  'tahiti': '#3ab7bf',
		  'silver': '#ecebff',
		  'bubble-gum': '#ff77e9',
		  'bermuda': '#78dcca',
	
		},
		extend: {
	
		},
	  },
	  plugins: [require("daisyui")],
	  daisyui: {
		themes: [
		  {
		  'froggycandle': {
			"primary": "#ffffff",
			"secondary": "#09090b",
			"accent": "#ecebff",
			"neutral": "#565584",
			"base-100": "#27272A",
		  }
		},
		  "coffee",
		],
	  }
}
