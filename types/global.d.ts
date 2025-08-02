// types/global.d.ts
import '@42pub/typed-sails';

declare global {
	// Расширяем глобальную область видимости
	const sails: import('@42pub/typed-sails').default;
}
