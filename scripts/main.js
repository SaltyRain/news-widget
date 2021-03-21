function parseData(data) {
    const str = JSON.stringify(data);
    return JSON.parse(str);
}

const getData = async () => {
    try {
        const loader = document.createElement("div");
        loader.className = "loader";
        loader.id = "loader";
        loader.textContent = "LOADING...";
        const pageTitle = document.querySelector(".page-title");
        pageTitle.after(loader);

        const data = await fetch(
            "https://saltyrain.github.io/widget-data/data.json"
        ).then((res) => {
            const resJSON = res.json();
            return resJSON;
        });

        const parsedData = parseData(data);
        return parsedData;
    } catch (error) {
        console.log(error, "error");
    }
};

function sortAndLocalizeDataByDate(data) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    };

    const sortedData = data
        .sort((firstMessage, secondMessage) => {
            const firstMessageDate = new Date(firstMessage.dateTime);
            const secondMessageDate = new Date(secondMessage.dateTime);

            return firstMessageDate - secondMessageDate;
        })
        .map((message) => {
            const messageDate = new Date(message.dateTime);
            message.dateTime = messageDate.toLocaleDateString("ru", options);
            return message;
        });

    return sortedData;
}

function renderMessages(dataByDate) {
    const widget = document.querySelector(".widget");
    const loader = document.getElementById("loader");
    loader.style.display = "none";

    dataByDate.map((item) => {
        const wrapper = document.createElement("div");
        wrapper.className = "message";

        const title = document.createElement("h3");
        title.innerHTML = item.title;
        title.className = "message--title";

        const author = document.createElement("p");
        author.innerHTML = item.author;
        author.className = "message--author";
        const text = document.createElement("span");
        text.innerHTML = "Текст: ";
        text.className = "author--text";

        const dateTime = document.createElement("p");
        dateTime.innerHTML = item.dateTime;
        dateTime.className = "message--dateTime";

        const source = document.createElement("a");
        source.innerHTML = "Читать в источнике";
        source.target = "_blank";
        source.href = item.source;
        source.className = "message--source button";

        const itemWrapper = document.createElement("div");
        itemWrapper.className = "message--item-wrapper";

        const statusWrapper = document.createElement("div");
        statusWrapper.className = "message--status-wrapper";
        statusWrapper.innerHTML = "Прочитано";

        const status = document.createElement("input");
        status.type = "checkbox";
        status.className = "message--status";
        status.addEventListener("change", () => {
            const message = status.parentElement.parentElement;
            const activeClass = "message_checked";
            if (status.checked) {
                message.classList.add(activeClass);
            } else {
                message.classList.remove(activeClass);
            }
        });

        widget.append(wrapper);
        wrapper.append(dateTime);
        wrapper.append(title);

        wrapper.append(statusWrapper);
        statusWrapper.append(status);

        wrapper.append(itemWrapper);
        itemWrapper.append(author);
        author.prepend(text);
        itemWrapper.append(source);
    });
}

(async function createFeed() {
    const { messages: data } = await getData();
    const dataByDate = sortAndLocalizeDataByDate(data);
    const loader = document.getElementById("loader");
    loader.innerHTML = `<button class='message--icon'>
        <span class='message--icon-count'>${data.length}</span>
    </button>`;
    loader.addEventListener("click", () => renderMessages(dataByDate));
})();
