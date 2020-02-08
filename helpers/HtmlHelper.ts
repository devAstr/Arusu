import marked from 'marked';
import DOMPurify from 'dompurify';

export default class HtmlHelper {
    static Encode(str: string): string {
        let div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    static Decode(s: string) {
        let div = document.createElement('div');
        div.innerHTML = s;
        return div.innerText || div.textContent;
    }

    static markdown(src: string) {
        return this.purify(marked(src));
    }

    static purify(src: string) {
        let regex: RegExp = /^https:/gim;
        DOMPurify.addHook('afterSanitizeAttributes', (node: any) => {
            // set all elements owning target to target=_blank
            if ('target' in node) {
                node.setAttribute('target', '_blank');
            }

            // set non-HTML/MathML links to xlink:show=new
            if (!node.hasAttribute('target') &&
                (node.hasAttribute('xlink:href') || node.hasAttribute('href'))) {
                node.setAttribute('xlink:show', 'new');
            }

            // build an anchor to map URLs to
            let anchor: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

            // check all href attributes for validity
            if (node.hasAttribute('href')) {
                anchor.href = node.getAttribute('href');
                if (anchor.protocol && !anchor.protocol.match(regex)) {
                    node.removeAttribute('href');
                }
            }
            // check all action attributes for validity
            if (node.hasAttribute('action')) {
                anchor.href = node.getAttribute('action');
                if (anchor.protocol && !anchor.protocol.match(regex)) {
                    node.removeAttribute('action');
                }
            }
            // check all xlink:href attributes for validity
            if (node.hasAttribute('xlink:href')) {
                anchor.href = node.getAttribute('xlink:href');
                if (anchor.protocol && !anchor.protocol.match(regex)) {
                    node.removeAttribute('xlink:href');
                }
            }
        });

        return DOMPurify.sanitize(src);
    }
}