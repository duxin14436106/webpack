import count from './js/count'
// import sum from './js/sum'
import './css/index.css'
import './less/index.less'
import './sass/index.scss'
import './sass/index.sass'
import './stylus/index.styl'
import './css/iconfont.css'


console.log('count', count(2,1));    


document.getElementById('btn').onclick(() => {
    import(
        /* webpackChunkName: 'sum', webpackPrefetch: true */'./js/sum')
    .then(({sum}) => {
        console.log(sum(2,1, 3,4,5,6));
    })
})

let arr =[1,2,3]
console.log(arr.includes(1));



if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }