document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let width = 8
    let height = 8
    let bombNum = 10
    let squares = []
    let flags = 0
    let isGameOver = false
    let isGameStart = false

    let h1timer = document.querySelector('.timer')
    let seconds = 0
    let ms = 0
    h1timer.innerHTML = `${seconds}:${ms}`
    let timer = null
    btn = document.getElementById('btn')
    btn.addEventListener('click', function() {
        clearInterval(timer)
        grid.innerHTML = ''
        squares = []
        flags = 0
        isGameOver = false
        isGameStart = false
        createBoard(width, height, bombNum)
        btn.innerHTML = '🙂'
        seconds = 0
        ms = 0
        h1timer.innerHTML = `${seconds}:${ms}`
        timer = null
        bombCounter.innerHTML = bombNum - flags
    })

    let bombCounter = document.querySelector('.bombCounter')
    bombCounter.innerHTML = bombNum - flags

    let rightMouseDown = false
    let leftMouseDown = false
    
    // create board
    function createBoard(width, height, bombNum) {
        let widthpx = width * 25
        let heightpx = height * 25
        grid.style.width = String(widthpx) + "px"
        grid.style.height = String(heightpx) + "px"

        const bombsArray = Array(bombNum).fill('bomb')
        const emptyArray = Array(width * height - bombNum).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        for (let i = 0; i < width * height; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            // normal click
            square.addEventListener('click', function(e) {
                if (rightMouseDown) return
                click(square)
            })

            // right click
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square)
            }

            // left and right click
            square.addEventListener('mousedown', function(e) {
                if (e.button === 0) leftMouseDown = true
                else if (e.button === 2) rightMouseDown = true
            })
            
            square.addEventListener('mouseup', function(e) {
                if (leftMouseDown && rightMouseDown) {
                    clickNeighbors(square, width, height)
                    // console.log('click neighbors')
                }
                if (e.button === 0) leftMouseDown = false
                else if (e.button === 2) rightMouseDown = false
            })
        }

        // add numbers
        for (let i = 0; i < squares.length; i++) {
            let count = 0
            const isLeftEdge = (i % width === 0) // check if a square is on the left edge
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                // check all 8 sqaures around this valid square
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) count++ // left
                if (i < width * height - 1 && !isRightEdge && squares[i + 1].classList.contains('bomb')) count++ // right
                if (i > width - 1 && squares[i - width].classList.contains('bomb')) count++ // up
                if (i < width * (height - 1) && squares[i + width].classList.contains('bomb')) count++ //down
                if (i > width && !isLeftEdge && squares[i - width - 1].classList.contains('bomb')) count++ // upper left
                if (i > width - 1 && !isRightEdge && squares[i - width + 1].classList.contains('bomb')) count++ // upper right
                if (i < width * (height - 1) && !isLeftEdge && squares[i + width - 1].classList.contains('bomb')) count++ // lower left
                if (i < width * (height - 1) && !isRightEdge && squares[i + width + 1].classList.contains('bomb')) count++ // lower right
                squares[i].setAttribute('num', count)
            }
        }
    }
    createBoard(width, height, bombNum)

    // check the neighboring squares of a square whose flagNum = num
    function clickNeighbors(square, width, height) {
        let total = square.getAttribute('num')
        countFlag(square, width, height)
        let flagNum = square.getAttribute('flagNum')
        if (square.classList.contains('checked') && total == flagNum) {
            let curID = square.id
            const isLeftEdge = (curID % width === 0)
            const isRightEdge = (curID % width === width - 1)
            setTimeout(() => {
                if (curID > 0 && !isLeftEdge) {
                    const newID = squares[parseInt(curID) - 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID < width * height - 1 && !isRightEdge) {
                    const newID = squares[parseInt(curID) + 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID > width - 1) {
                    const newID = squares[parseInt(curID) - width].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID < width * (height - 1)) {
                    const newID = squares[parseInt(curID) + width].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID > width && !isLeftEdge) {
                    const newID = squares[parseInt(curID) - width - 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID > width - 1 && !isRightEdge) {
                    const newID = squares[parseInt(curID) - width + 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID < width * (height - 1) && !isLeftEdge) {
                    const newID = squares[parseInt(curID) + width - 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
                if (curID < width * (height - 1) && !isRightEdge) {
                    const newID = squares[parseInt(curID) + width + 1].id
                    const newSquare = document.getElementById(newID)
                    if (!newSquare.classList.contains('flag')) click(newSquare)
                }
            }, 10)
        }
    }

    // count the number of flags around a square
    function countFlag(square, width, height) {
        let curID = square.id
        let flagNum = 0
        const isLeftEdge = (curID % width === 0)
        const isRightEdge = (curID % width === width - 1)

        if (curID > 0 && !isLeftEdge) {
            const newID = squares[parseInt(curID) - 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID < width * height - 1 && !isRightEdge) {
            const newID = squares[parseInt(curID) + 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID > width - 1) {
            const newID = squares[parseInt(curID) - width].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID < width * (height - 1)) {
            const newID = squares[parseInt(curID) + width].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID > width && !isLeftEdge) {
            const newID = squares[parseInt(curID) - width - 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID > width - 1 && !isRightEdge) {
            const newID = squares[parseInt(curID) - width + 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID < width * (height - 1) && !isLeftEdge) {
            const newID = squares[parseInt(curID) + width - 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        if (curID < width * (height - 1) && !isRightEdge) {
            const newID = squares[parseInt(curID) + width + 1].id
            const newSquare = document.getElementById(newID)
            if (newSquare.classList.contains('flag')) flagNum++
        }
        square.setAttribute('flagNum', flagNum)
    }

    // add a flag
    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked')) {
            if (!square.classList.contains('flag')) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
            } else {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }
            bombCounter.innerHTML = bombNum - flags
        }
    }

    // click a square
    function click(square) {
        let curID = square.id
        // set timer
        if (!isGameStart && !isGameOver) {
            timer = setInterval(() => {
                if (ms === 9) {
                    ++seconds;
                    ms = 0;
                }
                ++ms;
                h1timer.innerHTML = `${seconds}:${ms}`;
            }, 100)
            isGameStart = true
        }
        if (isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            gameOver(square)
        } else {
            let total = square.getAttribute('num')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                checkForWin()
                return
            }
            checkSquare(square, curID, width, height) // run checkSquare if the square is blank
        }
        square.classList.add('checked')
        checkForWin()
    }

    // check the neighboring squares of a square
    function checkSquare(square, curID, width, height) {
        const isLeftEdge = (curID % width === 0)
        const isRightEdge = (curID % width === width - 1)
        setTimeout(() => {
            if (curID > 0 && !isLeftEdge) {
                const newID = squares[parseInt(curID) - 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare) // recursion
            }
            if (curID < width * height - 1 && !isRightEdge) {
                const newID = squares[parseInt(curID) + 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID > width - 1) {
                const newID = squares[parseInt(curID) - width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID < width * (height - 1)) {
                const newID = squares[parseInt(curID) + width].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID > width && !isLeftEdge) {
                const newID = squares[parseInt(curID) - width - 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID > width - 1 && !isRightEdge) {
                const newID = squares[parseInt(curID) - width + 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID < width * (height - 1) && !isLeftEdge) {
                const newID = squares[parseInt(curID) + width - 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
            if (curID < width * (height - 1) && !isRightEdge) {
                const newID = squares[parseInt(curID) + width + 1].id
                const newSquare = document.getElementById(newID)
                click(newSquare)
            }
        }, 10)
    }

    function gameOver(square) {
        console.log("Game is Over")
        isGameStart = false
        isGameOver = true
        btn.innerHTML = '😢'
        clearInterval(timer)

        // show all the bombs
        squares.forEach(square => {
            if (square.classList.contains('bomb')) square.innerHTML = '💣'
        })
    }

    // check for win
    function checkForWin() {
        if (isGameOver == true) return
        let checked = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('checked')) checked++
        }
        if (checked === squares.length - bombNum) {
            console.log('WIN! 😀')
            isGameStart = false
            isGameOver = true
            btn.innerHTML = '😀'
            clearInterval(timer)
            // show all the bombs
            squares.forEach(square => {
                if (square.classList.contains('bomb')) square.innerHTML = '🚩'
            })
        }
    }

    $('#beginner').click(function() {
        clearInterval(timer)
        width = 8
        height = 8
        bombNum = 10
        grid.innerHTML = ''
        squares = []
        flags = 0
        isGameOver = false
        isGameStart = false
        createBoard(width, height, bombNum)
        btn.innerHTML = '🙂'
        seconds = 0
        ms = 0
        h1timer.innerHTML = `${seconds}:${ms}`
        timer = null
        bombCounter.innerHTML = bombNum - flags
    })

    $('#intermediate').click(function() {
        clearInterval(timer)
        width = 16
        height = 16
        bombNum = 40
        grid.innerHTML = ''
        squares = []
        flags = 0
        isGameOver = false
        isGameStart = false
        createBoard(width, height, bombNum)
        btn.innerHTML = '🙂'
        seconds = 0
        ms = 0
        h1timer.innerHTML = `${seconds}:${ms}`
        timer = null
        bombCounter.innerHTML = bombNum - flags
    })

    $('#expert').click(function() {
        clearInterval(timer)
        width = 30
        height = 16
        bombNum = 99
        grid.innerHTML = ''
        squares = []
        flags = 0
        isGameOver = false
        isGameStart = false
        createBoard(width, height, bombNum)
        btn.innerHTML = '🙂'
        seconds = 0
        ms = 0
        h1timer.innerHTML = `${seconds}:${ms}`
        timer = null
        bombCounter.innerHTML = bombNum - flags
    })
})