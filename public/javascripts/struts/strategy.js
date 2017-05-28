//策略定义
var strategy = function(e){
	this.register = {};
	this.define = function(name, construct){
        if (!this.register[name]){
            this.register.push(name);
            this.register[name] = new construct(e);
		}
	};
};

