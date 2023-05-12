function getRepositories() {
    user = 'Sittlon'
    apirepo = `https://api.github.com/users/${user}`

    listrepos = $.getJSON(apirepo + '/repos', function(data) {
        function compare(a, b) {
            if (a.watchers > b.watchers) {
                return -1
            }
            if (a.watchers < b.watchers) {
                return 1
            }
            return 0
        }

        data.sort(compare)
        for (const [i, value] of data.entries()) {
            if (value.name == "Sittlon.github.io" || value.name == "github-readme-stats" || value.name == "Sittlon" || value.name == "imgui-node-editor")
                continue;
            slider = document.getElementById("slider-projects")
            listItemRepo = document.createElement('li')
            if (i == 0) {
                listItemRepo.setAttribute("class", "slider--item slider--item-left")
            }
            if (i == 1) {
                listItemRepo.setAttribute("class", "slider--item slider--item-center")
            }
            if (i > 2) {
                listItemRepo.setAttribute("class", "slider--item slider--item-right")
            }
            a = document.createElement('a')
            p1 = document.createElement('p')
            p2 = document.createElement('p')
            div = document.createElement('div')
            pTitle = document.createElement('p')

            a.setAttribute("href", value.html_url)
            a.setAttribute("target", "_blank")
            div.setAttribute("class", "slider--item-title")
            p1.setAttribute("class", "slider--item-title")
            p2.setAttribute("class", "slider--item-description")

            p1.innerHTML = value.name
            p2.innerHTML = value.description

            pTitle.innerHTML = value.language
            pTitle.style.fontSize = 40 + "px"
            pTitle.style.color = colorData[value.language].color

            div.appendChild(pTitle)
            a.appendChild(div)
            a.appendChild(p1)
            a.appendChild(p2)
            listItemRepo.appendChild(a)
            slider.appendChild(listItemRepo)
        }

    });
}