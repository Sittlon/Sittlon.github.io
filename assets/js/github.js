  var projectCount = 0;

  function getRepositories() {
      user = 'Sittlon'
      apirepo = `https://api.github.com/users/${user}`

      listrepos = $.getJSON(apirepo + '/repos', function(data) {
          console.log(data)

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
              if (value.name == "Sittlon.github.io" || value.name = "github-readme-stats" || value.name == "Sittlon")
                  break;
              slider = document.getElementById("slider-projects")
              listItemRepo = document.createElement('li')
              if (i == 1) {
                  listItemRepo.setAttribute("class", "slider--item slider--item-left")
              }
              if (i == 0) {
                  listItemRepo.setAttribute("class", "slider--item slider--item-center")
              }
              if (i == 2) {
                  listItemRepo.setAttribute("class", "slider--item slider--item-right")
              }
              if (i > 2) {
                  listItemRepo.setAttribute("class", "slider--item slider--item")
              }
              a = document.createElement('a')
              p1 = document.createElement('p')
              p2 = document.createElement('p')
              div = document.createElement('div')
              img = document.createElement('img')


              a.setAttribute("href", value.html_url)
              a.setAttribute("target", "_blank")
              div.setAttribute("class", "slider--item-image")
              img.setAttribute("src", "assets/img/" + value.name + ".png")
              p1.setAttribute("class", "slider--item-title")
              p2.setAttribute("class", "slider--item-description")

              p1.innerHTML = value.name
              p2.innerHTML = value.description

              div.appendChild(img)
              a.appendChild(div)
              a.appendChild(p1)
              a.appendChild(p2)
              listItemRepo.appendChild(a)
              slider.appendChild(listItemRepo)
          }

      });
  }
