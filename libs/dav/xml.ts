export class XMLNode {
   private name: string;
   private value?: string;
   private attributes?: Record<string, string>;
   private elements: XMLNode[];

   constructor(name: string, value?: string);
   constructor(name: string, attributes?: Record<string, string>);
   constructor(name: string, args?: string | Record<string, string>) {
      this.name = name;
      if (typeof args == 'string') {
         this.value = args;
      } else if (typeof args == 'object') {
         this.attributes = args;
      }
      this.elements = [];
   }

   elem(node: XMLNode): XMLNode;
   elem(name: string, value?: string): XMLNode;
   elem(args: string | XMLNode, value?: string): XMLNode {
      const node = typeof args == 'string' ? new XMLNode(args, value) : args;
      this.elements.push(node);
      return node;
   }

   toString = () => [`<?xml version="1.0" encoding="utf-8"?>`, this.writeElement(this)].join('');

   private writeElement(element: XMLNode): string {
      const xml = [];
      // attributes
      const attrs = [];
      for (const key in element.attributes) {
         attrs.push(`${key}="${element.attributes[key]}"`);
      }
      if (attrs.length > 0) {
         xml.push(`<${element.name} ${attrs.join(' ')}>`);
      } else {
         xml.push(`<${element.name}>`);
      }
      // value
      if (element.value) {
         xml.push(element.value);
      }
      // elements
      for (const item of element.elements) {
         xml.push(this.writeElement(item));
      }
      // end tag
      xml.push(`</${element.name}>`);
      return xml.join('');
   }
}
