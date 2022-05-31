import './style.css';

import { of, map, Observable, throwError, pipe } from 'rxjs';
import { catchError, defaultIfEmpty, every, retry, take, throwIfEmpty } from 'rxjs/operators';

// --------------------------RxJS Error Handling------------------
const observe = {
  next: data => console.log(data),
  error: message => console.error('Error messegae xử lý tại đây: ' + message),
  complete: () => console.log('Complete')
}
// catchError(): Dùng để bẫy lỗi và xử lý. Là 1 operator sử dụng trong pipe, nhân vào 1 đối số là 1 callback funcion.
// Callback function nhận vào 2 dối số vả trả về 1 observable, đối số 1 là error mà observable gốc throw, đối số 2 chính là observalbe throwError (thường dùng đối số 2 để retry lại observable khi có lỗi) 
/**
 * Usecase1: Dùng để bẫy lỗi và return 1 observable mới, emit 1 giá trị mới, để returun 1 giá trị gì đó khi có lỗi, làm cho observable không bị lọt vào observe.error và vẫn được complete.
 * Usecase2: Dùng để throw 1 error mới (Error mới thân thiện với người dùng chẳng hạn)
 * Usecase3: Dùng để retry lại observalbe nếu có error bằng việc return đối số thứ 2 của callback truyền vào catchError()
 */
const hasValues = [4, 5];
of(1, 2, 3, 4, 5).pipe(
  map(x => {
    if(hasValues.includes(x)) {
      throw new Error('Duplicates value')
    }
    return x;
  }),
  catchError((error, caught) => of('defaule value if error')),
)
throwError('This is a error không thân thiện').pipe(
  catchError((err) => {
    const beatifulError = new Error('This is an error friendly')
    return throwError(beatifulError)
  })
)

of(1, 2, 3, 4, 5).pipe(
  map(x => {
    if(hasValues.includes(x)) {
      throw new Error('Duplicates value')
    }
    return x;
  }),
  catchError((error, caught) => caught),
  take(5)
)

// retry(x: number) Là 1 operator sử dụng trong pipe, sử dụng để chạy lại observable nếu có lỗi
/**
 * Nhận vào 1 đối số là 1 number, quyết định số lần chạy lại của observable, nếu không truyền thì chạy vô hạn nếu cứ có lỗi thì chạy
 * 
 */
of(1, 2, 3, 4, 5).pipe(
  map(x => {
    if(hasValues.includes(x)) {
      throw new Error('Duplicates value')
    }
    return x;
  }),
  retry(3)
)

// -----------------------RxJS Conditional Operator-----------------------
// defaultIfEmpty(): Nhận vào 1 đối số là 1 giá trị bất kỳ, khi observable gốc không emit gì mà complete (Observable empty) thì observable gốc sẽ emit giá trị truyền vào defaultIfEmpty()
of().pipe(
  defaultIfEmpty('Default value')
)

// throwIfEmpty(): Nhận vào 1 callback function, callback function return 1 giá trị bất kỳ, nếu observable gốc empty thì sẽ throwError giá trị mà callback function return.
of().pipe(
  throwIfEmpty(() => 'Observable is empty')
)

// every(): Nhận vào 1 callback function và return giá trị boolean, nếu tát cả các lần every đều trả về true thì observable gôc emit true, ngược lại emit false.
of(1, 2, 3, 4, 5).pipe(
  every(x => x < 6)
)

// iif(): iif() là 1 function operator, nhận vào 3 đối số
/**
 * Đối số 1: callback function return 1 giá trị boolean
 * Đối số 2, 3 là ObservedValueOf
 * Nếu đối số 1 return true thì Observake truyền vào đối số 2 được chạy, ngược lại thì đối số 3.
 */