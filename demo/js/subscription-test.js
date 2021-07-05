import { Component, html } from './lit-component.js';
import blpApi from '../../client/bloomberg-blpapi-service.js';;

let blpClient;

const presets = [
    { security: 'IBM US Equity', fields: 'LAST_PRICE,VOLUME' }
];

export class SubscriptionTestElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subscriptionDefs: presets,
            subscriptionData: {},
            availableFields: [],
            selectedField: ''
        };

        blpApi.getClient()
            .then(client => {
                blpClient = client;
                blpClient.addEventListener('SubscriptionData', e => {
                    let { error, id, type, ...marketDataEvents } = e;
                    if (error) {
                        console.error(`Error occurred for subscription: ${id}`, error);
                        return;
                    }

                    let state = this.state;
                    state.subscriptionData[id].data = marketDataEvents;
                    state.availableFields = Object.keys(
                        Object.assign({},
                            ...Object.keys(state.subscriptionData)
                                .map(k => state.subscriptionData[k].data)));
                    if (state.selectedField === '' && state.availableFields.length > 0) {
                        state.selectedField = state.availableFields[0];
                    }
                    this.setState(state);
                });
            });  
    }

    addDefinition() {
        let state = this.state;
        state.subscriptionDefs.push({ security: '', fields: '' });
        this.setState(state);
    }

    selectField(e) {
        let state = this.state;
        state.selectedField = e.target.value;
        this.setState(state);
    }

    async subscribe() {
        let state = this.state;

        let subscriptions = state.subscriptionDefs.map(d => ({
            security: d.security,
            fields: d.fields.split(',')
        }));

        let results = await blpClient.subscribe(subscriptions);

        results.forEach((result, idx) => {
            if (result.error) {
                console.error(`Failed to create subscription: ${subscriptions[idx].security}`, result.error);
            }
            else {
                const { id } = result;
                state.subscriptionData[id] = {
                    security: subscriptions[idx].security,
                    data: {}
                };   
            }
        });

        this.setState(state);
    }

    async unsubscribe(id) {
        let state = this.state;
        await blpClient.cancel(id);
        delete state.subscriptionData[id];
        this.setState(state);
    }

    render() {
        return html`
<div>
    <h1>Subscriptions</h1>
    <div>
        <h2>Definitions</h2>
        <button @click=${() => this.addDefinition()}>Add</button>
        <table>
            <thead><tr><th>Security</th><th>Fields</th></tr></thead>
            <tbody>
            ${this.state.subscriptionDefs.map(d => html`<tr>
                <td contenteditable="true" @input=${e => d.security = e.target.innerText}>${d.security}</td>
                <td contenteditable="true" @input=${e => d.fields = e.target.innerText}>${d.fields}</td>
            </tr>`)}
            </tbody>
        </table>
        <button @click=${() => this.subscribe()}>Subscribe</button>
    </div>
    <div>
        <h2>Data</h2>
        <table>
            <thead><tr><th>ID</th><th>Security</th>
                <th><select @change=${e => this.selectField(e)}>${this.state.availableFields.map(f => html`<option value=${f}>${f}</option>`)}</select></th>
            <th></th></tr></thead>
            <tbody>
            ${Object.keys(this.state.subscriptionData).map(k => html`<tr>
                <td>${k}</td>
                <td>${this.state.subscriptionData[k].security}</td>
                <td>${this.state.subscriptionData[k].data[this.state.selectedField]}</td>
                <td><button @click=${() => this.unsubscribe(k)}>Remove</button></td>
            </tr>`)}
            </tbody>
        </table>
    </div>
</div>`;
    }
}

customElements.define('subscription-test', SubscriptionTestElement);