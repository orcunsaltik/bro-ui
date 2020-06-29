import $ from 'Bro';

let puiId = 0;

const Plugger = (prototype, fn) => {

let inst;

const name    = prototype.name;
const dataKey = `bro-ui.${name}`;
const Widget  = typeof fn === 'function' 
    ? fn 
    :  function (element, options, id, scope) {
        
        puiId += 1;
        
        inst       = this;
        inst.puiId = puiId;
        inst.suiId = id;
        inst.muiId = id > 1 
            ? `${inst.puiId - (id - 1)}-${id}`
            : `${inst.puiId}-${id}`;

        inst.evns  =  `.${dataKey}.${id}`;
        inst.scope = scope;

        inst.dataKey = dataKey;

        inst.self = element instanceof $ 
            ? element 
            : $(element);

        const attrData = inst.self.data();

        const keys = $.keys(attrData);
        const size = keys.length;
        let i = 0;
        
        for (; i < size; i += 1) {
            const k = keys[i];
            const v = attrData[k];
            if ($.isJson(v)) {
                attrData[k] = JSON.parse(v);
            }
        }

        inst.opts = $.extend(true, {}, inst.options, options, attrData);

        inst.c = inst.opts.classes || {};
        inst.q = inst.opts.query   || {};

        inst.showIcon    = inst.opts.showIcon;
        inst.toggleClass = inst.opts.toggleClass;

        return inst._init();
    };

    Widget.prototype.constructor = Widget;
        Widget.prototype.dataKey = dataKey;
                Widget.prototype = $.extend(true, {}, Plugger.prototype, prototype);

    let i = 0;

    if (!$.fn[name]) {
         $.fn[name] = function (options, args) {
             
            const self  = this;
            const scope = self.length;
            
            if (scope) {
                self.each(() => {
                    const $self = $(self);
                    const $data = $self.data(dataKey);
                    if ($.isStr(options) && $.isFn(Widget.prototype[options])) {
                        Widget.prototype[options]($data, inst, args);
                    } else if ($.isObj(options) || $.isUndefined(options)) {
                        if (!$data) {
                            i += 1;
                            $self.data(dataKey, new Widget($self, options, i, scope));
                        }
                    }
                });
            }
        };
    }
};

Plugger.prototype = {
    
    unplug(element) {
         
        const inst = this;
        const data = element.data(inst.dataKey);

        if (!inst._unplug(data)) {
            element.children()
                       .off(data.evns).end()
                       .off(data.evns)
                .removeData(data.dataKey);
        }
     },
     
    _unplug: $.noop,
    
    _up(elem, callback, args) {
        const height = elem.outerHeight();
        const inst = this;

        elem
            //        .off($.event.transitionEnd)
            .removeClass('hide down')
               .addClass('hiding up')
                    .css('height', `${height}px`).cssUpdate()
                    .css('height', 0)
            .onTransitionEnd(() => {
                elem
                            .css('height', '')
                    .removeClass('hiding down not')
                       .addClass('hide up');
                return callback && callback.call(inst, elem, args);
            }, 'height');
    },
    _down(elem, callback, args) {

        const inst = this;

        elem
            //        .off($.event.transitionEnd)
            .removeClass('hide up')
               .addClass('hiding down')
                    .css('height', `${elem.absOuterHeight()}px`)
            .onTransitionEnd(() => {
                elem
                            .css('height', '')
                    .removeClass('hiding up')
                       .addClass('hide down not');

                return callback && callback.call(inst, elem, args);
            }, 'height');
    },
    _trigger() {
        let cbck;
        const args = arguments;
        const inst = this;
        const event = args[0];

        if (event && $.isStr(event)) {
            inst.self.trigger(event, inst);
            if ($.isFn((cbck = inst.opts[event]))) {
                cbck.apply(inst, $.splice.call(args, 1));
            }
        }
    },
    
    _setIcons(el, ico) {

        const inst = this;

        if (!inst.opts.showIcon) {
            return;
        }

        const size = el.length;        
        let i = 0;
        for (; i < size; i += 1) {
            if (!el[i]) {
                return;
            }

            const elem = $(el[i]);
              let icon = ico || elem.data('icon') || inst.self.data('icon') || inst.c.icon;

            if (!icon || !$.isStr(icon)) {
                return;
            }

            icon = icon.trim().split(',');

            let left           = '';
            let right          = '';
            let isActiveLeft   = '';
            let isActiveRight  = '';
            let tplLeft        = '';
            let tplRight       = '';
            let hasBorderLeft  = '';
            let hasBorderRight = '';
            let alignClass     = '';
            let parentClass    = '';
            let toggleClass    = '';
            let searchClass    = '';
            let rpc;

            if (icon.length > 1) {
                if (icon[0]) {
                       left = icon[0].split('|');
                    tplLeft = left[0];
                    if (left.length > 1) {
                         isActiveLeft = left[1].split(':');
                        hasBorderLeft = isActiveLeft[1] === 'bordered';
                         isActiveLeft = isActiveLeft[0];
                    } else {
                                  tplLeft = tplLeft.split(':');
                            hasBorderLeft = tplLeft[1] === 'bordered';
                                  tplLeft = tplLeft[0];
                    }
                }
                if (icon[1]) {
                       right = icon[1].split('|');
                    tplRight = right[0];
                    if (right.length > 1) {
                         isActiveRight = right[1].split(':');
                        hasBorderRight = isActiveRight[1] === 'bordered';
                         isActiveRight = isActiveRight[0];
                    } else {
                              tplRight = tplRight.split(':');
                        hasBorderRight = tplRight[1] === 'bordered';
                              tplRight = tplRight[0];
                    }
                }
            } else if (icon[0]) {
                   left = icon[0].split('|');
                tplLeft = left[0];
                if (left.length > 1) {
                     isActiveLeft = left[1].split(':');
                    hasBorderLeft = isActiveLeft[1] === 'bordered';
                     isActiveLeft = isActiveLeft[0];
                } else {
                          tplLeft = tplLeft.split(':');
                    hasBorderLeft = tplLeft[1] === 'bordered';
                          tplLeft = tplLeft[0];
                }
            }

            if (left && right) {
                parentClass = 'has-icons';
                if (hasBorderLeft && hasBorderRight) {
                    parentClass += '-bordered';
                } else if (hasBorderLeft) {
                    parentClass += '-left-bordered';
                } else if (hasBorderRight) {
                    parentClass += '-right-bordered';
                }
            } else if (left) {
                parentClass = 'has-icon-left';
                if (hasBorderLeft) {
                    parentClass += '-bordered';
                }
            } else if (right) {
                parentClass = 'has-icon-right';
                if (hasBorderRight) {
                    parentClass += '-bordered';
                }
            }

            if ((rpc = elem.data('parentClass'))) {
                elem.removeClass(rpc);
            }

            elem
                .addClass(parentClass)
                .data({
                    parentClass: '',
                    toggleClass: '',
                    searchClass: ''
                }).children('span.icon').remove();

            if (left) {
                elem.append(`<span class='icon is-left' aria-hidden='true'>
                                <i class='${tplLeft}'></i>
                            </span>`);
                if (isActiveLeft) {
                     alignClass = 'left';
                    toggleClass = `${tplLeft} ${isActiveLeft}`;
                }
            }

            if (right) {
                elem.append(`<span class='icon is-right' aria-hidden='true'>
                                <i class='${tplRight}'></i>
                            </span>`);
                if (isActiveRight) {
                     alignClass = 'right';
                    toggleClass = `${tplRight} ${isActiveRight}`;
                }
            }

            alignClass  = alignClass ? `.is-${alignClass}` : '';
            searchClass = `span.icon${alignClass} > i`;

            elem.data({
                    parentClass,
                    toggleClass,
                    searchClass
            });
        }
    },
    
    _delIcons(el) {
        el.each(function () {
            $(this).removeClass($(this).data('parentClass'))
                    .data({
                        parentClass: '',
                        toggleClass: '',
                        searchClass: ''
                    }).children('span.icon')
.remove();
        });
    },
    
    _toggleIcons(el) {
        if (!this.showIcon) {
            return;
        }

        let i = 0;
        const size = el.length;

        for (; i < size; i += 1) {
            
            if (!el[i]) {
                return;
            }

            const elem   = $(el[i]);
            const search = elem.data('searchClass');
            const toggle = elem.data('toggleClass');

            if (search && toggle) {
                elem
                           .find(search)
                    .toggleClass(toggle);
            }
        }
    },
    
    _tpl() {
        
        const inst = this;
        const args = arguments;
          let tmpl = args[0];
        
        const rExp = new RegExp('{{(.+?)}}', 'gm') || inst.opts.tmpl.regExp;

        const fn = (match, capture) => {

            const prop = capture.split('.');
            const size = prop.length;
              let reps = inst[prop[0]];
              
            let i = 1;
            for (; i < size; i += 1) {
                if (undefined === (reps = reps[prop[i]])) {
                    break;
                }
            }

            if (undefined === reps) {
                reps = match;
            } else if ($.isFn(reps)) {
                reps = reps.apply(inst, $.splice.call(args, 1));
            }

            return reps;
        };

        tmpl = tmpl.replace(rExp, fn);

        return tmpl;
    }
};

$.ui = Plugger;
