export declare global {
	declare namespace NodeJS {
		interface Global {
			[str: string]: any
		}
	}
}
