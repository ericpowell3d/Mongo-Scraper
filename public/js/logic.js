// Global variables
let page = 0;
let totalPages = 0;

function scrapeMemes() {
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function (data) {
        page = 0;
        displayMemes();
    });
}

function displayMemes() {
    window.scroll(0, 0);
    $(".pageBtn").text(`Page ${page + 1}`);
    $.getJSON("/memes", function (data) {
        let hot = data.reverse();
        totalPages = Math.floor((hot.length - 1) / 10);
        $("#memes").empty();
        for (let i = page * 10; i < (page * 10) + 10; i++) {
            if (hot[i]) {
                $("#memes").append(`
                <div class="memeCard" id="${hot[i]._id}">
                    <div class="memeImg">
                        <a href="${hot[i].imageLink}" target="_blank"><img class="memeImgLink" src="${hot[i].imageLink}"></a>
                    </div>
                    <div class="memeText">
                        <a class="memeHeader" href="${hot[i].postLink}" target="_blank">${hot[i].header}</a>
                        <p>by <a class="memeAuthor" href="${hot[i].authorLink}" target="_blank">${hot[i].author}</a></p>
                    </div>
                    <div class="memeComment">
                        <div class="memeCommentBtn">View Comments</div>
                    </div>
                </div>
                `);
            }
        }
    })
}

displayMemes();

function backPage() {
    page = 0;
    displayMemes();
}
function prevPage() {
    if (page > 0) {
        page -= 1;
        displayMemes();
    }
    else {
        console.log(`You can't go to page 0!`);
    }
}
function nextPage() {
    if (page < totalPages) {
        page += 1;
        displayMemes();
    }
    else {
        console.log(`No more pages to display! (Total pages: ${totalPages + 1})`);
    }
}

$(document).on("click", "#genBtn", scrapeMemes);
$(document).on("click", ".backBtn", backPage);
$(document).on("click", ".prevBtn", prevPage);
$(document).on("click", ".nextBtn", nextPage);