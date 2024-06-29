const promo = document.querySelector("body");
const openMenu = document.querySelector(".promo-hamburger");
const overlay = document.querySelector(".promo-overlay");
const cross = document.querySelector(".promo-overlay__cross");
const menu = document.querySelector(".promo-overlay__menu");
const menuItem = document.querySelectorAll(".promo-overlay__menu-item");
const form = document.querySelector(".contacts__form");
const sendForm = document.querySelector(".contacts__form-send");

openMenu.addEventListener("click", () => {
    overlay.classList.add("open");
    promo.classList.add("stop");
});
const closeMenu = () => {
    overlay.classList.remove("open");
    promo.classList.remove("stop");
};
cross.addEventListener("click", () => {
    closeMenu();
});
overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
        closeMenu();
    }
});
menuItem.forEach((item) => {
    item.addEventListener("click", () => {
        const link = item.querySelector("a");
        if (link) {
            const href = link.getAttribute("href");
            if (href === "#exp" || href === "#promo" || href === "#contacts") {
                closeMenu();
            }
        }
    });
});

const request = async (data) => {
    try {
        const req = await fetch(
            "https://server-weld-nine.vercel.app/api/formData",
            {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-type": "application/json",
                },
            }
        );

        return req;
    } catch (err) {
        console.log(err);
    }
};

form.addEventListener("submit", (e) => {
    const formSend = e;
    const formData = {};

    const inputs = form.querySelectorAll("input[name]");
    const textarea = form.querySelector("textarea");
    const checkbox = document.getElementById("check");

    const removeErrorMessage = (item) => {
        item.parentNode.classList.remove(`error-${item.id}`);
    };
    const addErrorMessage = (item) => {
        item.parentNode.classList.add(`error-${item.id}`);
    };

    inputs.forEach((item) => {
        const id = item.id;

        switch (id) {
            case "name":
                const regEx = /[а-яА-ЯЁёa-zA-Z]/;
                if (item.value.length >= 2 && regEx.test(item.value)) {
                    formData[item.name] = item.value;
                    removeErrorMessage(item);
                } else {
                    addErrorMessage(item);
                }
                formSend.preventDefault();
                break;
            case "mail":
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailRegex.test(item.value)) {
                    formData[item.name] = item.value;
                    removeErrorMessage(item);
                } else {
                    addErrorMessage(item);
                }
                formSend.preventDefault();
                break;
            case "check":
                if (checkbox.checked) {
                    formData[checkbox.name] = checkbox.checked;
                    removeErrorMessage(checkbox.parentNode);
                } else {
                    addErrorMessage(checkbox.parentNode);
                }
                formSend.preventDefault();
                break;
        }
    });

    if (textarea.value.length === 0) {
        addErrorMessage(textarea);
        formSend.preventDefault();
    } else {
        formData[textarea.name] = textarea.value;
        removeErrorMessage(textarea);
        formSend.preventDefault();
    }

    const arr = ["name", "mail", "textarea", "checkbox"];

    if (arr.every((item) => item in formData)) {
        request(formData).then((res) => {
            if (res.status === 200) {
                sendForm.classList.add("contacts__form-send-visible");
                setTimeout(() => {
                    sendForm.classList.remove("contacts__form-send-visible");
                }, 1500);
            } else {
                console.log("no ok");
            }
        });
        formSend.preventDefault();
        form.reset();
    } else {
        console.log("error");
    }
});
