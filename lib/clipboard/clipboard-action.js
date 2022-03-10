import select from"select";class ClipboardAction{constructor(t){this.resolveOptions(t),this.initSelection()}resolveOptions(t={}){this.action=t.action,this.container=t.container,this.emitter=t.emitter,this.target=t.target,this.text=t.text,this.trigger=t.trigger,this.selectedText=""}initSelection(){this.text?this.selectFake():this.target&&this.selectTarget()}selectFake(){var t="rtl"==document.documentElement.getAttribute("dir"),t=(this.removeFake(),this.fakeHandlerCallback=()=>this.removeFake(),this.fakeHandler=this.container.addEventListener("click",this.fakeHandlerCallback)||!0,this.fakeElem=document.createElement("textarea"),this.fakeElem.style.fontSize="12pt",this.fakeElem.style.border="0",this.fakeElem.style.padding="0",this.fakeElem.style.margin="0",this.fakeElem.style.position="absolute",this.fakeElem.style[t?"right":"left"]="-9999px",window.pageYOffset||document.documentElement.scrollTop);this.fakeElem.style.top=t+"px",this.fakeElem.setAttribute("readonly",""),this.fakeElem.value=this.text,this.container.appendChild(this.fakeElem),this.selectedText=select(this.fakeElem),this.copyText()}removeFake(){this.fakeHandler&&(this.container.removeEventListener("click",this.fakeHandlerCallback),this.fakeHandler=null,this.fakeHandlerCallback=null),this.fakeElem&&(this.container.removeChild(this.fakeElem),this.fakeElem=null)}selectTarget(){this.selectedText=select(this.target),this.copyText()}copyText(){let e;try{e=document.execCommand(this.action)}catch(t){e=!1}this.handleResult(e)}handleResult(t){this.emitter.emit(t?"success":"error",{action:this.action,text:this.selectedText,trigger:this.trigger,clearSelection:this.clearSelection.bind(this)})}clearSelection(){this.trigger&&this.trigger.focus(),window.getSelection().removeAllRanges()}set action(t="copy"){if(this._action=t,"copy"!==this._action&&"cut"!==this._action)throw new Error('Invalid "action" value, use either "copy" or "cut"')}get action(){return this._action}set target(t){if(void 0!==t){if(!t||"object"!=typeof t||1!==t.nodeType)throw new Error('Invalid "target" value, use a valid Element');if("copy"===this.action&&t.hasAttribute("disabled"))throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');if("cut"===this.action&&(t.hasAttribute("readonly")||t.hasAttribute("disabled")))throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');this._target=t}}get target(){return this._target}destroy(){this.removeFake()}}module.exports=ClipboardAction;