type Digit = number | string;
type ShortColor = `#${Digit}${Digit}${Digit}`;
type LongColor = `#${Digit}${Digit}${Digit}${Digit}${Digit}${Digit}`;  // Error
export type Color = ShortColor | LongColor;

export type Customer = {
	id: number;
	name: string;
	email: string;
	password: string;
	avatarColor?: Color
}

export type User = {
	id: number;
	name: string;
	email: string;
}