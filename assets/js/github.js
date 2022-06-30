  function getRepositories() 
  {
    user = 'Sittlon'
    apirepo = `https://api.github.com/users/${user}`

     listrepos = $.getJSON(apirepo + '/repos', function (data) {
              console.log('data now', data)

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
              data.forEach(v => {
                  slider = document.getElementById("slider-projects")
                  listItemRepo = document.createElement('li')
                  listItemRepo.setAttribute("class", "slider--item slider--item-center")
                  a = document.createElement('a')
                  p1 = document.createElement('p')
                  p2 = document.createElement('p')

                  p1.innerHTML = v.name
                  a.appendChild(p1)
                  a.appendChild(p2)
                  listItemRepo.appendChild(a)
                  slider.appendChild(listItemRepo)
              });
          });
  }