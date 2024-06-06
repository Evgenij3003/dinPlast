/*==========================================================================================================================================================================*/
/* Делегирование события "клик" на документе */
document.addEventListener("click", function(e) {
    const targetElement = e.target;
    
    // Закрытие мобильного меню:
    if (document.querySelector(".phone-header__body.open") 
        && !targetElement.classList.contains("phone-header") && !targetElement.closest(".phone-header__body")) {
            document.querySelector(".phone-header__body").classList.remove("open");
    }

    // Открытие/закрытие всплывашки телефона:
    if (targetElement.classList.contains("phone-header") && window.innerWidth < 479.98) {
        let headerPhoneMenu = document.querySelector(".phone-header__body");
        if (!headerPhoneMenu.classList.contains("open")) {
            headerPhoneMenu.classList.add("open");
        } else {
            headerPhoneMenu.classList.remove("open");
        }
    }
});		



/*==========================================================================================================================================================================*/
/* Scroll Header */
if (document.querySelector("header[data-scroll]")) {
    const header = document.querySelector("header");
    const headerBody = document.querySelector(".header__body");
    const headerHeight = Number(header.offsetHeight);
    let scrollPoint = header.dataset.scroll ? header.dataset.scroll : 1;
    let scrollTop = window.scrollY;
    let scrollValue, scrollDirection;
    scrollPoint === "header" ? scrollPoint = headerHeight : null;
    scrollHeader();


    // Функция анимации header при скролле:
    function scrollHeader() {
        if (scrollTop > scrollPoint) {
            !header.classList.contains("scroll") ? header.classList.add("scroll") : null;
        } else {
            header.classList.contains("scroll") ? header.classList.remove("scroll") : null;
        }
    }


    window.addEventListener("scroll", function (e) {
        scrollTop = window.scrollY;
        scrollDirection = scrollTop < scrollValue ? "up" : "down";
        scrollValue = scrollTop;
        scrollHeader();
    });
}



/*==========================================================================================================================================================================*/
/* Динамический Адаптив */
function dynamicAdapt(type) {
	this.type = type;
}


// Функция адаптива:
dynamicAdapt.prototype.init = function () {
	const _this = this;		
	this.оbjects = [];																				// Массив объектов.
	this.daClassname = "_dynamic_adapt_";	
	this.nodes = document.querySelectorAll("[data-da]");											// Массив DOM-элементов.
	for (let i = 0; i < this.nodes.length; i++) {													// Наполнение оbjects объектами.
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "47.99";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}
	this.arraySort(this.оbjects);
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {					// Массив уникальных медиа-запросов.
		return "(" + this.type + "-width: " + item.breakpoint + "em)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});
	for (let i = 0; i < this.mediaQueries.length; i++) {											// Навешивание слушателя на медиа-запрос и вызов обработчика 
		const media = this.mediaQueries[i];															// при первом запуске.
		const mediaSplit = String.prototype.split.call(media, ",");
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];			
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {			// Массив объектов с подходящим брейкпоинтом.
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};


// Функция перемещения:
dynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};


// Функция перемещения:
dynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === "last" || place >= destination.children.length) {
		destination.insertAdjacentElement("beforeend", element);
		return;
	}
	if (place === "first") {
		destination.insertAdjacentElement("afterbegin", element);
		return;
	}
	destination.children[place].insertAdjacentElement("beforebegin", element);
}


// Функция возврата: 
dynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
        parent.children[index].insertAdjacentElement("beforebegin", element);
    } else {
        parent.insertAdjacentElement("beforeend", element);
    }
}


// Функция получения индекса внутри родителя:
dynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};


// Функция сортировки массива по breakpoint и place по возрастанию для this.type = min по убыванию для this.type = max:
dynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}
				if (a.place === "first" || b.place === "last") {
					return -1;
				}	
				if (a.place === "last" || b.place === "first") {
					return 1;
				}
				return a.place - b.place;
			}	
			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}	
				if (a.place === "first" || b.place === "last") {
					return 1;
				}
				if (a.place === "last" || b.place === "first") {
					return -1;
				}
				return b.place - a.place;
			}	
			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};
const da = new dynamicAdapt("max");
da.init();



/*==========================================================================================================================================================================*/
/* Маска для телефона */
if (document.querySelector("[data-input-phone]")) {
    let phoneInputs = document.querySelectorAll("[data-input-phone]");

    let getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, "");
    }

    function onPhonePaste(e) {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let pasted = e.clipboardData || window.clipboardData;
        if (pasted) {
            let pastedText = pasted.getData("Text");
            if (/\D/g.test(pastedText)) {
                input.value = inputNumbersValue;
                return;
            }
        }
    }

    function onPhoneInput(e) {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let selectionStart = input.selectionStart;
        console.log(input.selectionStart);
        let formattedInputValue = "";
        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        if (["7", "8"].indexOf(inputNumbersValue[0]) > -1) {
            let firstSymbols = (inputNumbersValue[0] == "8") ? "+8" : "+7";
            formattedInputValue = input.value = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            }
        } else {
            formattedInputValue = "";
        }
        input.value = formattedInputValue;
    }

    function onPhoneKeyDown(e) {
        let inputValue = e.target.value.replace(/\D/g, "");
        if (e.keyCode == 8 && inputValue.length == 1) {
            e.target.value = "";
        }
    }

    for (let phoneInput of phoneInputs) {
        phoneInput.addEventListener("keydown", function(e) {
            onPhoneKeyDown(e);
        });
        phoneInput.addEventListener("input", function(e) {
            onPhoneInput(e);
        });
        phoneInput.addEventListener("paste", function(e) {
            onPhonePaste(e);
        });
    }
}



/*==========================================================================================================================================================================*/
/* Фокус на input */
if (document.querySelector("input")) {
    let inputs = document.querySelectorAll("input");
    inputs.forEach(input => {
        input.addEventListener("focus", function() {
            input.parentElement.classList.add("focus");
        });
        input.addEventListener("blur", function() {
            input.parentElement.classList.remove("focus");
        });
    });
}


/*==========================================================================================================================================================================*/
/* Валидация Формы */
let forms = document.querySelectorAll("[data-form]");
let form;
for (let i = 0; i < forms.length; i++) {
    form = forms[i];
    form.addEventListener("submit", formSend);
}  


// Функция проверки и обработки результатов валидации формы:
async function formSend(e) {
    e.preventDefault();
    let error = formValidate(form);
    let formData = new FormData(form);
    if (error === 0) {
        let response = await fetch("form.php", {
            method: "POST",
            body: formData
        });
        if (response.ok) {
            let result = await response.json();
            form.reset();
            // document.querySelector(".popup-message").classList.add("_show");
            // let buttonPopup = document.querySelector(".popup-message__button");
            // buttonPopup.addEventListener("click", function (e) {
            //     this.closest(".popup-message").classList.remove("_show");
            // });
        } else {
            alert("Ошибка отправки");
        }
    } else {
        alert("Заполните обязательные поля");
    }
}
            
            
// Функция валидации формы:
function formValidate(form) {
    let error = 0;
    let inputsRequired = form.querySelectorAll("[data-required]");
    for (let index = 0; index < inputsRequired.length; index++) {
        const input = inputsRequired[index];
        formRemoveError(input);
        if (input.hasAttribute("data-input-mail")) {
            if (emailTest(input)) {
                formAddError(input);
                error++;
            }
        }
        if (input.hasAttribute("data-input-phone")) {
            if (input.value.length !== 18) {
                formAddError(input);
                error++;
            }
        } 
        if (input.value.length < 2) {
            formAddError(input);
            error++;
        }
        if (input.getAttribute("type") === "checkbox" && input.checked === false) {
            formAddError(input);
            error++;
        }
    }
    return error;
}
            
            
// Функция добавления полю ввода и его родителю класса "_error" (ошибка):
function formAddError(input) {
    input.classList.add("error");
    input.parentElement.querySelector("span").removeAttribute("hidden");
}
        
            
// Функция удаления у поля ввода и его родителя класса "_error" (ошибка):
function formRemoveError(input) {
    input.classList.remove("error");
    input.parentElement.querySelector("span").setAttribute("hidden", "");
}


// Функция проверки email-адреса:
function emailTest(input) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
}



/*==================================================================================================================================================================*/
/* Прикрепление к форме фотографии */	
if (document.querySelector(".input-file")) {
    const inputFileElements = document.querySelectorAll(".input-file");
    inputFileElements.forEach(inputFileElement => {
        const inputFile = inputFileElement.querySelector("input");
        const inputText = inputFileElement.querySelector("p");
        inputFile.addEventListener("change", () => {
            uploadFile(inputFile, inputText);
        });
    });
}


// Функция проверки выбранного пользователем файла:
function uploadFile(inputFile, inputText) {
    const file = inputFile.files[0];
    if (!["application/msword", "application/rtf", "application/pdf", "text/plain"].includes(file.type)) {
        alert("Недопустимый формат файла");
        inputFile.value = "";
        return;																				
    }
    if (file.size > 5 * 1024 * 1024) {
        alert("Файл должен быть менее 5 МБ");
        inputFile.value = "";
        return;																				
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        inputText.innerHTML = file.name;
        const inputFileElem = inputText.closest(".input-file");
        inputFileElem.classList.add("active");
    };
    reader.onerror = function (e) {
        alert("Ошибка загрузки файла");
    };
    reader.readAsDataURL(file);
};



/*==========================================================================================================================================================================*/
/* Полифилы */
(function () {
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (css) {
            var node = this;
            while (node) {
                if (node.matches(css)) return node;
                else node = node.parentElement;
            }
            return null;
        };
    }
})();
