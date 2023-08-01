class ListManager {
    constructor(dom, parseTemplate) {
        this.listInfoData = [];
        this.template = parseTemplate;
        this.container = dom;
    }

    init(data) {
        this.listInfoData = [];
        data.forEach(item => {
            this.listInfoData.push(this.template(item));
        });

        return this
    } 
    clearList() {
        while(this.container.firstChild) {
            this.container.removeChild(this.container.firstChild);
        };
        
        return this
    }
    render() {
        this.listInfoData.forEach(item => {
            this.container.appendChild(item.template);            
        });

        return this
    }
    addEvent(type, EventFn) {
        this.container.addEventListener(type, (e) => EventFn(e));

        return this
    }
}

export default ListManager