/**
 * @fileoverview
 *
 * API for egistering and requesting dependencies via DOM APIs.
 */

 /**
  * @hidden
  */
interface DependencyInjectionRequestEvent extends Event {
	detail?: {
		providerName?: string;
		inject?: (dependency: unknown) => unknown;
	};
}

/**
 * Registers an element as a provider of a dependency.
 * 
 * @param element The element registering as a provider of the dependency.
 * @param dependency The class instance of the dependency to inject into consumers.
 * @param dependencyName The registered name of the dependency. For class types, optional and inferred from the class name.
 */
export function registerProvider<T extends object>(element: HTMLElement, dependency: T, dependencyName?: string): void;
export function registerProvider(element: HTMLElement, dependency: object | string | number | boolean, dependencyName?: string): void
export function registerProvider(element: HTMLElement, dependency: any, dependencyName?: string): void {
	const registeredProviderName = typeof dependency === 'object'
		? (dependency?.constructor?.name ?? dependency?.prototype?.name)
		: dependencyName;
	
	if (!registeredProviderName) {
		throw new Error('registerProvider: No name was provided for the dependency, or could not be inferred.');
	}

	element.addEventListener('dom-dependency-injection-request', (evt: DependencyInjectionRequestEvent) => {
		const requestedProviderName = evt?.detail?.providerName;

		if (!requestedProviderName) {
			throw new Error('registerProvider: request missing provider name');
		}

		if (requestedProviderName === registeredProviderName) {
			const inject = evt?.detail?.inject;

			if (!inject) {
				throw new Error(`registerProvider: failed to inject ${registeredProviderName}: 'inject' not provided by consumer`);
			}

			inject(dependency);
			evt.stopImmediatePropagation();
			evt.preventDefault(); // signal that request was fulfilled to consumer
		}
	});
}

/**
 * Requests a dependency type from the nearest registered provider in the DOM.
 * 
 * @param element The element requesting the dependency.
 * @param dependency The class constructor or name of the dependency to retrieve.
 * @param onFulfilled Callback used to inject the dependency in the requester.
 */
export function requestDependency<T extends object>(element: HTMLElement, dependency: new (...args: unknown[]) => T, onFulfilled: (dependency: T) => void): void;
export function requestDependency<T>(element: HTMLElement, dependency: string, onFulfilled: (dependency: T) => void): void;
export function requestDependency<T>(element: HTMLElement, dependency: unknown, onFulfilled: (dependency: T) => void): void {
	let dependencyName;
	
	switch(typeof dependency) {
		case 'string':
			dependencyName = dependency;
			break;
		case 'function':
			dependencyName = dependency?.name ?? dependency?.constructor?.name ?? dependency?.prototype?.name
			break;
	}

	if (!dependencyName) {
		throw new Error('requestDependency: No dependency name provided.');
	}
	
	const dependencyRequestEvent = new CustomEvent('dom-dependency-injection-request', {
		detail: {
			providerName: dependencyName,
			inject: onFulfilled,
		},
		bubbles: true,
		composed: true,
	});

	if (!element.dispatchEvent(dependencyRequestEvent)) {
		throw new Error(`requestDependency: Request for ${dependencyName} not handled. Is a registered provider an ancestor?`);
	}
}
