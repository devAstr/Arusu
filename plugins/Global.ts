import Vue from 'vue'

let _g: any = window || global;

_g.IsNullOrWhiteSpace = function (str: any) {
    return typeof str !== 'string' || !str || str.trim() == '';
};

String.prototype.format = function (this: string, ...params: string[]): string {
    let str = this;
    params.forEach(((value, index) => {
            str = str.replace(new RegExp(`\\\{${index}\\\}`, 'g'), value);
        }
    ));
    return str;
};

String.prototype.toRegExpString = function (this: string): string {
    return this.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
};

String.prototype.toDarkColor = function (this: string): string {
    return `#${convert(this.substr(1, 2))}${convert(this.substr(3, 2))}${convert(this.substr(5, 2))}`;

    function convert(x: string): string {
        let meta = 255 - parseInt(`0x${x.substr(0, 2)}`);
        return meta.toString(16);
    }
};

DataTransferItemList.prototype.find =
    function (this: DataTransferItemList, func: (x: DataTransferItem) => boolean): DataTransferItem | null {
        for (let i = 0; i < this.length; i++) {
            if (func(this[i])) {
                return this[i];
            }
        }
        return null;
    };

Array.prototype.Distinct = function <T>(this: Array<T>): Array<T> {
    return this.filter((value, index, self) => self.indexOf(value) === index);
};

Vue.prototype.$global = _g;
