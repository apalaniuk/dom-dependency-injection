import { fixture, html, expect } from '@open-wc/testing';
import { spy } from 'sinon';
import {
	DependencyConsumerCustomElement,
	DependencyProviderCustomElement,
	ConsumerParentCustomElement,
} from './components/smoke-test-components'; 

class TestDependency {
	public dependencyFunction: sinon.SinonSpy;

	constructor() {
		this.dependencyFunction = spy();
	}
}

describe('smoke test', function() {
	[{
		mode: 'open'
	}, {
		mode: 'closed'
	}].forEach(shadowRootInit => {
		it(`works across shadow DOM boundary when dependency consumer is in ${shadowRootInit.mode} shadow root`, async () => {
			const dependency = new TestDependency();

			await fixture(html`
				<dependency-provider>
					<consumer-parent></consumer-parent>
				</dependency-provider>
			`);

			const dependencyProvider = document.getElementsByTagName('dependency-provider')[0] as DependencyProviderCustomElement;
			dependencyProvider.registerProvider(dependency);

			const dependencyConsumer = document.createElement('dependency-consumer') as DependencyConsumerCustomElement;

			const consumerParent = document.getElementsByTagName('consumer-parent')[0] as ConsumerParentCustomElement;
			consumerParent.renderTemplate(shadowRootInit as ShadowRootInit, dependencyConsumer);

			dependencyConsumer.requestDependency(TestDependency, (injected: TestDependency) => {
				injected.dependencyFunction();
			});

			expect(dependency.dependencyFunction.calledOnce).to.be.true;
		});
	});
});
