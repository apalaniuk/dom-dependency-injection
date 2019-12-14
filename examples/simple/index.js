/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* global HtmlLogger */

import { registerProvider, requestDependency } from '../../lib/index.js';
import '../../node_modules/html-logger/dist/html-logger.bundle.js';

class MyDataStore {
	constructor(logger) {
		this.logger = logger;
	}
}

/**
 * A custom element which is a provider of a data store (MyDataStore).
 * Note that an element can provide multiple types of stores.
 */
customElements.define('dependency-provider', class DependencyProviderCustomElement extends HTMLElement {
	constructor() {
		super();

		// @ts-ignore
		const logger = new HtmlLogger({name: 'Simple Dependency Injection Example'});
		logger.init(true);

		this.dataStore = new MyDataStore(logger);

		registerProvider(this, this.dataStore);

		logger.debug('Dependency Provider: Registered dependency.');
	}
});

/**
 * A custom element which requests a dependency of type MyDataStore.
 */
customElements.define('dependency-consumer', class DependencyConsumerCustomElement extends HTMLElement {
	connectedCallback() {
		if (!this.dataStore) {
			requestDependency(this, MyDataStore, (dataStore) => {
				this.dataStore = dataStore;

				this.dataStore.logger.debug('Dependency Consumer: Hello, world! I\'m using the logger from the injected data store.');
			});
		}
	}
});

/**
 * A full web component (custom element + template + shadow DOM) which contains a DependencyConsumer
 * in its shadow DOM. In this case, the shadow root is closed, meaning it's invisible/inaccessible
 * to outside elements.
 */
window.customElements.define('some-app-component', class SomeAppComponent extends HTMLElement {
	connectedCallback() {
		if (this.shadowRoot) {
			return;
		}

		const template = document.getElementById('some-app-component-template');
		const shadowRoot = this.attachShadow({ mode: 'closed' });
		// @ts-ignore
		shadowRoot.appendChild(template.content.cloneNode(true));
	}
});
