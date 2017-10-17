(function($) {

    var validation = function() {

        var rules = {  // Private object

            email : {
               check: function(value) {

                   if(value) {
                       return testPattern(value,".+@.+\..+");
                   }
                   return true;
               },
               msg : "Enter a valid e-mail address."
            },
            required : {

               check: function(value) {

                   if(value) {
                       return true;
                   }
                   else {
                       return false;
                   }
               },
               msg : "This field is required."
            }
        }
        var testPattern = function(value, pattern) {   // Private Method

            var regExp = new RegExp("^"+pattern+"$","");
            return regExp.test(value);
        }
        return { // Public methods

            addRule : function(name, rule) {

                rules[name] = rule;
            },
            getRule : function(name) {

                return rules[name];
            }
        }
    }
    //A new instance of our object in the jQuery namespace.
    $.validation = new validation();
})(jQuery);

var Form = function(form) {

    var fields = [];
    // Get all input elements in form
    $(form[0].elements).each(function() {
        var field = $(this);
        // We're only interested in fields with a validation attribute
        if(field.attr('validation') !== undefined) {
            fields.push(new Field(field));
        }
    });
    this.fields = fields;
}

var Field = function(field) {
    this.field = field;
    this.valid = false;
    this.attach("change");
}

Field.prototype = {
    // Method used to attach different type of events to
    // the field object.
    attach : function(event) {

        var obj = this;
        if(event == "change") {
            obj.field.bind("change",function() {
                return obj.validate();
            });
        }
        if(event == "keyup") {
            obj.field.bind("keyup",function(e) {
                return obj.validate();
            });
        }
    },

    // Method that runs validation on a field
    validate : function() {

        // Create an internal reference to the Field object.
        var obj = this,
            // The actual input, textarea in the object
            field = obj.field,
            errorClass = "errorlist",
            errorlist = $(document.createElement("ul")).addClass(errorClass),
            // A field can have multiple values to the validation
            // attribute, seprated by spaces.
            types = field.attr("validation").split(" "),
            container = field.parent(),
            errors = []; 

        // If there is an errorlist already present
        // remove it before performing additional validation
        field.next(".errorlist").remove();

        // Iterate over validation types
        for (var type in types) {

            // Get the rule from our Validation object.
            var rule = $.Validation.getRule(types[type]);
            if(!rule.check(field.val())) {

                container.addClass("error");
                errors.push(rule.msg);
            }
        }
        // If there is one ore more errors
        if(errors.length) {

            // Remove existing event handler
            obj.field.unbind("keyup")
            // Attach the keyup event to the field because now
            // we want to let the user know as soon as she has
            // corrected the error
            obj.attach("keyup");

            // Empty existing errors, if any.
            field.after(errorlist.empty());
            for(error in errors) {

                errorlist.append("<li>"+ errors[error] +"</li>");
            }
            obj.valid = false;
        }
        // No errors
        else {
            errorlist.remove();
            container.removeClass("error");
            obj.valid = true;
        }
    }
}

Form.prototype = {
    validate : function() {

        for(field in this.fields) {

            this.fields[field].validate();
        }
    },
    isValid : function() {

        for(field in this.fields) {

            if(!this.fields[field].valid) {

                // Focus the first field that contains
                // an error to let user fix it.
                this.fields[field].field.focus();

                // As soon as one field is invalid
                // we can return false right away.
                return false;
            }
        }
        return true;
    }
}