type Digit = number | string;
type ShortColor = `#${Digit}${Digit}${Digit}`;
type LongColor = `#${Digit}${Digit}${Digit}${Digit}${Digit}${Digit}`;  // Error
type Color = ShortColor | LongColor;

export type Customer = {
	id: number;
	name: number;
	email: string;
	password: Date;
	avatarColor?: Color
}