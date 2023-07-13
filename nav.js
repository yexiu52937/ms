document.addEventListener('DOMContentLoaded', () => {
    $('#topbar-game-ul').hide()
    let topbar_game = document.getElementById('topbar-game')
    topbar_game.addEventListener('click', function(e) {
        if ($('#topbar-game').val() === '') {
            $('#topbar-game-ul').hide()
            $('#topbar-game').val('Game')
        } else if ($('#topbar-game').val() === 'Game') {
            $('#topbar-game-ul').show()
            $('#topbar-game').val('')
        }
    })
})