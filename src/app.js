(function () {
    'use strict'

    angular.module('jamon.mus', [
        'app.core'
        , 'app.artist'
    ])
})();

(function () {
    'use strict'

    angular.module('app.core', ['ui.router'])

    angular.module('app.core')
        .config(routes)

    function routes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/404');

        var states = [
            {
                state: '404',
                config: {
                    url: '/404',
                    template: '<div> 404 x_x </div><li><a ui-sref="home">Home</a></li>'
                    , title: "404"
                }
            }
            , {
                state: 'home',
                config: {
                    url: '/home',
                    template: '<div class="row"> <h3>- home</h3> <search-artist></search-artist> </div>',
                    title: 'home'
                }
            }
        ]

        states.forEach(function (state) {
            $stateProvider.state(state.state, state.config);
        })
    }

    angular.module('app.core')
        .service('DataService', DataService)

    DataService.$inject = ['$http']

    function DataService($http) {
        var SPOTIFY_API = "https://api.spotify.com/v1/"

        this.load_artist = function (name) {
            return $http.get(SPOTIFY_API + "search?q=" + name + "&type=artist")
                        .then(get_artist)
                        .catch(get_artist_fail)
        }

        function get_artist(response) {
            return response.data.artists.items
        }

        function get_artist_fail(err) {
            console.log(err)
        }
    }
})();

(function () {
    angular.module('app.artist', ['app.core'])

    angular.module('app.artist')
        .component('searchArtist', {
            templateUrl: './search-artist.component.html',
            controllerAs: 'vm',
            controller: Controller
        })
    
    Controller.$inject = ['DataService']
    function Controller(DataService) {
        var vm = this;
        vm.artist = ''
        vm.artist_data = {}
        vm.find = function(artist) {
            DataService.load_artist(artist).then(function(data) {
                console.log(data);
                vm.artist_data = data
            })
        } 
    }
})();