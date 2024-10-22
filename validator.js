//Doi tuong `Validator`
function Validator(options) {
  var selectorRules = {};

  //Ham thuc hien Validate
  function validate(inputElement, rule) {
    //value: inputElement.value
    //test func: rule.test
    var errorMessage;
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector
    );

    //Lay ra cac rules cua selector
    var rules = selectorRules[rule.selector];

    //Lap qua tung rule & kiem tra
    //Neu co loi thi dung viec kiem tra
    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }

    return !errorMessage;
  }

  //Lay element cua form can validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    //Khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //Lap qua tung rules va validate
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        //Truong hop submit voi javascript
        if (typeof options.onSubmit === 'function') {
          var enableInputs = formElement.querySelectorAll('[name]');

          var formValues = Array.from(enableInputs).reduce(function (values, input) {
            return (values[input.name] = input.value) && values;
          }, {});
          options.onSubmit(formValues);
        } 
        //Truong hop submit voi hanh vi mac dinh
        else {
          formElement.submit();
        }
      }
    };

    //Lap qua moi rule va xu ly (Lang nghe su kien, blur, input, ...)
    options.rules.forEach(function (rule) {
      //Luu lai cac rules trong moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //Xu ly truong hop blur ra khoi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //Xu ly moi khi nguoi dung nhap
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

//Dinh nghia cac rules
//Nguyen tac cua cac rules
//1. Khi co loi => Tra ra message loi
//2. Khi hop le => Khong tra ra cai gi ca (undifined)
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là Email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Vui lòng nhập tối thiểu ${min} kí tự`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "Giá trị nhập vào không chính xác";
    },
  };
};
