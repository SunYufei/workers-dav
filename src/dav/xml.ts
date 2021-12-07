export default class XMLBuilder {
    private name: string
    private value?: string
    private attributes?: { [name: string]: string }
    private elements: XMLBuilder[]

    constructor(name: string, attributes?: {}, value?: string) {
        this.name = name;
        this.attributes = attributes;
        this.value = value;
        this.elements = [];
    }

    elem(name: string, attributes?: {}, value?: string): XMLBuilder {
        const el = new XMLBuilder(name, attributes, value);
        this.elements.push(el);
        return el;
    }

    add(element: XMLBuilder): void {
        this.elements.push(element)
    }

    build(): string {
        const xml = [];
        xml.push(`<?xml version="1.0" encoding="utf-8"?>`);
        xml.push(this.writeElement(this));
        return xml.join('');
    }

    private writeElement(element: XMLBuilder): string {
        const xml = [];
        // attributes
        const attrs = [];
        for (const key in element.attributes)
            attrs.push(`${key}="${element.attributes[key]}"`);
        if (attrs.length > 0)
            xml.push(`<${element.name} ${attrs.join(' ')}>`);
        else
            xml.push(`<${element.name}>`);
        // value
        if (element.value)
            xml.push(element.value)
        // elements
        for (const item of element.elements)
            xml.push(this.writeElement(item));
        // end tag
        xml.push(`</${element.name}>`);
        return xml.join('')
    }
}
