//Doi tuong `Validator`
function Validator(options) {
  //Ham thuc hien Validate
  function validate(inputElement, rule) {
    //value: inputElement.value
    //test func: rule.test
    var errorMessage = rule.test(inputElement.value);
    var errorElement =
      inputElement.parentElement.querySelector(options.errorSelector);

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  }

  //Lay element cua form can validate
  var formElement = document.querySelector(options.form);

  if (formElement) {
    options.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        //Xu ly truong hop blur ra khoi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //Xu ly moi khi nguoi dung nhap
        inputElement.oninput = function () {
          var errorElement =
            inputElement.parentElement.querySelector(options.errorSelector);
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
Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(value) ? undefined : "Trường này phải là Email";
    },
  };
};

Validator.minLength = function (selector, min) {
    return {
      selector: selector,
      test: function (value) {
        return value.length >= min ? undefined: `Vui lòng nhập tối thiểu ${min} kí tự`
      },
    };
  };