import { registerProvider, requestDependency } from '../../src/index';

export class DependencyProviderCustomElement extends HTMLElement {
	registerProvider(dependency, dependencyName?) {
		registerProvider(this, dependency, dependencyName);
	}
}

export class DependencyConsumerCustomElement extends HTMLElement {
	requestDependency(dependency, onFulfilled) {
		requestDependency(this, dependency, onFulfilled);
	}
}

export class ConsumerParentCustomElement extends HTMLElement {
	async renderTemplate(shadowRootInit: ShadowRootInit, ...children: HTMLElement[]) {		
		if (this.shadowRoot) {
			return;
		}

		const shadowRoot = this.attachShadow(shadowRootInit);

		for (const child of children) {
			shadowRoot.appendChild(child);
		}
	}
}

customElements.define('dependency-provider', DependencyProviderCustomElement);
customElements.define('dependency-consumer', DependencyConsumerCustomElement);
customElements.define('consumer-parent', ConsumerParentCustomElement);
