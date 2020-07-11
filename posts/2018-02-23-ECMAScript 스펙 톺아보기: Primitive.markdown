---
layout: post
title:  "ECMAScript 스펙 톺아보기: Primitive"
date:   2018-02-23 13:58:08
categories: javascript
---

![ECMAScript 스펙 톺아보기: Primitive](http://image.toast.com/aaaadh/real/2018/repimg/1.jpg)

### 프리미티브에 대한 의문

현재 팀 내부에서는 시니어들이 팀 인력 채용 프로세스를 개선하고 있다. 프로세스 중에서도 현재는 필기시험 문제를 재출제하는 중인데 이게 생각보다 쉽지 않아 매일 매일 서로 의견이 분분하다. 그러던 어느 날 프리미티브에 대한 의견을 나누던 중 자바스크립트의 프리미티브를 객체 같이 사용된다고 설명해도 되느냐 안되느냐의 문제를 놓고 토론을 하게 되었는데 내 의견은 표면적으로 객체처럼 사용할 수 있기에 객체 같이 취급된다고 표현해도 된다는 의견이었고 다른 한 멤버는 중간에 프리미티브 래퍼가 관여하는 내용이기 때문에 그렇게 설명하면 안 된다는 것이었다. 한 명은 표면적인 결과에 다른 한 명은 내부의 동작에 집중했던 내용이었지만 토론의 과정에서 프리미티브를 너무 가볍게 이해하고 있는 게 아닌가 싶다는 생각이 들었다. 사실 개발 작업에는 큰 영향을 주지 않는 내용이겠지만 팀 업무 중에는 자바스크립트 사내교육도 있기 때문에 조금 더 깊고 정확한 이해가 있어야겠다고 생각했다. 그래서 스펙상의 정의와 실제 동작 방법에 대해서 자세히 알아보기로 했다.

이 글에서는 프리미티브가 무엇이고 프리미티브 래퍼가 어떻게 관여하는지에 대한 내용을 스펙 문서와 몇 가지 실험을 토대로 다룬다. 원시라고 표기하려다가 사용되는 다른 용어들과의 이질감 때문에 그냥 프리미티브라고 표기하기로 했다. 이미 잘 알려진 내용을 다루기도 하지만 프리미티브에 대해 조금 더 자세히 알고 싶은 프런트 엔드 형, 누나를 위해 작성되었다. 일반적인 웹개발자라면 몰라도 되는 내용일 수 있다. 하지만 이야기할 때 **굳이** 명확하게 이야기하는 것을 좋아하는 사람이라면 짧은 글이니 읽도록 하자.


### 프리미티브 타입이란?

지겨운 이야기지만 짚고 넘어가자 자바스크립트에는 총 6개의 프리미티브 타입이 있다. undefined, null, boolean, string, number 그리고 마지막에 추가된 symbol이 있다. 여기에 프리미티브는 아니지만, object 타입만 더하면 ECMAScript에서 제공하는 언어 타입이 모두 정리된것이다.

스펙 문서 개요에서는 프리미티브 값을 설명할 때 아래와 같이 기술했다.

"A primitive value is a member of one of the following built-in types: Undefined, Null, Boolean, Number, String, and Symbol &#x2026;"

프리미티브 값은 내장 타입 중 한 종류에 속한다. 내장 타입 생성자하고는 별도의 개념이다. 아래와 같이 우리가 흔히 사용하고 있는 친구들이다.

```js
var numberPrimitive = 10;
var booleanPrimitive = false;
var stringPrimitivie = 'string boy';
```


### typeof

`typeof` 키워드를 이용하면 대상의 타입을 알 수 있다. 프리미티브 값에 직접 사용하면 해당 값의 타입을 알 수 있다. 함수는 실행 가능한 객체로 object 타입으로 분류된다. 그렇기 때문에 객체로서의 특성도 모두 가지고 있다. `typeof` 를 이용하면 ECMAScript 언어 타입을 구분할 수 있다. 특이점은 함수를 `typeof` 를 통해서 보면 "function" 으로 반환한다. ECMAScript 언어 타입에는 `function` 이라는 타입이 없는데도 말이다. typeof의 동작원리를 간단하게 설명하면 객체이면서 내부 프로퍼티 `[[Call]]` 이 구현되어 있다면 "function"을 반환한다. 함수에 대한 특별 대우인 것 같다. 함수와 객체를 구분해야 할 경우가 있으니 말이다. 여담이지만 `typeof null` 이 "object"를 리턴하는 점을 의아하게 생각할 수 있다. `null` 은 객체의 의도적인 부재(Intentional absence)를 뜻하는데 숫자 값이 없음을 뜻하는 0을 `typeof 0` 로 확인했을때 "number" 인점과 같은 맥락으로 객체가 없음을 뜻하는 `null` 도 "object"인것이다.


### 프리미티브의 특징

스펙에는 프리미티브에 직접적으로 연관된 단어가 총 세 개가 나온다.

-   프리미티브 값(Primitive Value)
-   프리미티브 타입(Primitive Type)
-   프리미티브 객체(Primitive Object).

프리미티브 값은 자바스크립트 언어 구현 중 가장 저수준의 데이텀을 뜻한다. 넘버 값의 경우 64-bit 배 정도의 바이너리 포맷 IEEE 754-2008 값이다. 그래서 소수점을 연산할때 IEEE754 표준의 [잘 알려진 문제](https://www.google.co.kr/search?q=%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8+%EB%B6%80%EB%8F%99%EC%86%8C%EC%88%98%EC%A0%90+%EC%98%A4%EB%A5%98)가 발생하기도 한다.(0.1 + 0.2) 프리미티브 값은 특정 프리미티브 타입에 속한다. 프리미티브 타입은 해당 프리미티브 값으로 만들어질 수 있는 모든 것들을 뜻한다. 프리미티브 타입은 프로퍼티를 가질 수 없다. 객체가 아니기 때문이다. 프리미티브 객체는 해당 프리미티브 타입에 대응되는 내장된 생성자를 통해 만든 인스턴스다. 이 인스턴스는 특정 타입의 프리미티브 값을 다루는 프로퍼티들을 포함하고 있으며 내부 슬롯(`[[PrimitiveValue]]`)에 프리미티브 값을 들고 있는 객체로 객체 타입에 속한다. 즉 프로퍼티를 가질 수 있다. 객체타입이니까. 프리미티브 객체가 들고 있는 프리미티브 값은 `valueOf()` 메서드를 이용해 꺼내올 수 있다.

예를 들면 숫자 10은 넘버 값(Number Value)이고 `number` 타입이 속한다. 그리고 `NaN` 과 `Infinity` 역시 `number` 타입에 속한다.(NaN과 Infinity는 IEEE754에 정의된 넘버 값이다.) `Number` 생성자를 통해 객체로 만들면 타입은 객체 타입이지만 `valueOf()` 를 통해 프리미티브 값을 구할 수 있다.

연산자를 이용해 연산을 할 때는 객체의 `valueOf()` 메서드를 수행한 결과로 평가하기 때문에 객체든 프리미티브 값이던 서로 연산이 가능하다.

```javascript
var num10 = 10; //넘버 값
typeof num10 // 'number', 넘버 값은 number 타입이다.
typeof NaN // 'number'
typeof Infinity // 'number'

var num10Obj = new Number(10); // 넘버 객체
typeof num10Obj // 'object'

console.log(num10Obj) // 크롬 브라우저에서는 콘솔로 내부 슬롯 [[PrimitiveValue]] 의 값을 확인 할 수 있다.

num10Obj.valueOf() // 10

num10 === num10Obj // 실제로는 num10 === num10Obj.valueOf(); 로 평가
```

`valueOf` 메서드는 오버라이드할 수 있다. 즉 내부 슬롯의 프리미티브 값을 반환하는게 아니라 객체의 의도에 맞게 다른 동작으로 변경 확장이 가능하다. 연산자 오버라이드를 할 수 없는 자바스크립트에서는 이점을 이용해 약소하나마 객체가 연산자에 적절히 반응하도록 개발할 수 있다. 이게 가능한 이유가 바로 내부적으로 객체의 `valueOf` 를 먼저 실행하고 그 결과 값으로 연산을 하기 때문이다.

연산자의 연산시 객체의 `valueOf` 가 실행된다는 점을 이용하면 연산자 오버라이드를 할 수 없는 자바스크립트에서도 약소하나마 객체가 연산자에 의도한대로 반응하도록 개발할 수 있다. 즉 내부 슬롯의 프리미티브 값을 반환하는게 아니라 객체의 의도에 맞게 다른 동작으로 변경 확장이 가능하다.

```js
num10Obj.valueOf = function() { return 50; }; // valueOf 메서드는 오버라이드할 수 있다.

num10 + num10Obj // 60

Number.prototype.valueOf.call(num10Obj); // 10, 여전히 내부 슬롯에는 10이라는 값이 들어가 있다.
```

프리미티브 값은 이뮤터블하다. 그리고 프리미티브 타입은 Call by value이고 객체는 Call by reference 다. 하지만 객체 타입이라고 하더라도 `valueOf()` 메서드를 통해 프리미티브 값을 이용해 연산을 하므로 기본적으로 값의 이뮤터블함은 변함이 없다. 그리고 프리미티브 객체를 연산한 결과는 프리미티브 값으로 변경된다는 것에 주의해야 한다.

```javascript
var n10a = 10;
var n10b = n10a; // 값이 복사되어 넘어간다.

n10b += 1;
n10a === n10b // false,

var no10a = new Number(10);
var no10b = no10a; // 참조가 전달된다., a와 b 둘다 같은 참조
var no10c = new Number(10);

no10a === no10b // true, 참조 비교를 한다.
no10a === no10c // false, 참조 비교를 한다.

no10b += 1;
no10a === no10b // false, num10Objb에는 이제 넘버 객체가 아닌 11이라는 넘버 값이 들어가 있다.
```


### 프리미티브 객체로의 형 변환

프리미티브 값은 프로퍼티를 가질 수 없다. 애초에 객체도 아니고 그저 메모리상에 정해진 만큼의 공간을 차지하고 있는 저 수준의 데이터 조각일 뿐이다.

```js
var num = 10;

num.newProp = 5;

console.log(num.newProp); // undefined
```

코드 자체는 실행이 정상적으로 되고 에러는 발생하지 않지만 프로퍼티는 생성이 되지 않는다. 이렇게 동작하는 이유는 스펙 중 `Set` 추상 오퍼레이션의 동작 때문인데 `Set` 은 인자로 객체와 프로퍼티명 그리고 값등을 전달 받아 객체의 프로퍼티로 특정한 값을 할당할 때 사용한다. `Set` 추상 오퍼레이션은 아래와 같다.

```
1. Assert: Type(O) is Object.
2. Assert: IsPropertyKey(P) is true.
3. Assert: Type(Throw) is Boolean.
4. Let success be ? O.[[Set]](P, V, O).
5. If success is false and Throw is true, throw a TypeError exception.
6. Return success.
```

오퍼레이션중 첫번째라인의 단언을 보면 대상의 타입이 `Object` 여야 한다. 즉 대상이 객체일때만 프로퍼티를 생성한다는 의미다. 객체가 아니라면 별도의 에러 없이 작업은 무시된다. 하지만 스트릭트 모드에서는 아래와 같이 `TypeError` 예외가 발생한다.

"Uncaught TypeError: Cannot create property 'newProp' on number '10'"

이렇게 스트릭트 모드에서 에러가 발생하는 내용은 스펙 중 [The Strict Mode Of ECMAScript](http://www.ecma-international.org/ecma-262/8.0/index.html#sec-strict-mode-of-ecmascript) 파트에서 찾아 볼수 있다.

"&#x2026;nor to a non-existent property of an object whose `[[Extensible]]` internal slot has the value false. In these cases a TypeError exception is thrown."

특정 식별자의 존재하지 않는 프로퍼티에 접근 시 대상의 `[[Extensible]]` 내부 슬롯이 `false` 값을 갖는 경우는 `TypeError` 예외를 발생하게 되는것이다. 다시 말하면 대상이 Extensible 하지 않으면 프로퍼티를 확장할 수 없으니 예외를 발생하는 것이다. 다행히 대상의 `[[Extensible]]` 내부 슬롯의 값을 확인하는 API가 자바스크립트 상에 노출되어 있어 코드에서 확인할 수 있다. 바로 `Object.isExtensible()` 메서드다.

```js
var obj = {};

console.log(Object.isExtensible(obj)) // true

var num = 10;

console.log(Object.isExtensible(num)) // false

console.log(Object.isExtensible(undefined)); // false
console.log(Object.isExtensible(null)); // false
console.log(Object.isExtensible(NaN)); // false
```

자바스크립트의 프리미티브의 가장 대표적인 특징은 아마도 암묵적인 프리미티브 객체로의 형 변환일 것이다. 그래서 `Number` 생성자를 사용해서 만든 객체가 아닌 프리미티브 number 값도 `Number` 생성자의 프로퍼티들을 사용할 수 있다. 마치 객체 처럼 말이다. 코딩할때의 편의성을 고려했을때도 필요한 기능이긴 하지만 자바의 오토박싱에 영향을 받은것으로 보인다.

```js
var num = 0.1234;

num.toFixed(2); // 0.12
```

간단한 함수를 `Number` 생성자의 프로토타입에 추가해서 형 변환이 실제로 일어나고 있는지 확인할 수 있다.

```js
Number.prototype.whoAmI = function() { console.log(typeof this);}

var num = 10;

typeof num; // "number"

num.whoAmI(); // "object"
typeof num // "number"
```

프리미티브 객체로의 형 변환은 추상 오퍼레이션 `[[ToObject]]` 에 의해 실질적으로 형 변환이 수행된다. 인자로 전달된 프리미티브 값의 타입에 따라 스펙의 변환 테이블을 토대로 정해진 생성자를 이용해 인자로 전달된 값을 내부 슬롯에 소유하고 있는 새로운 객체를 리턴한다. 다시 말하면 인자의 프리미티브 값과 동일하게 평가되는 프리미티브 객체를 반환한다. 형 변환이 일어나는 원인은 다양하지만 실제 형 변환은 `[[ToObject]]` 추상 오퍼레이션을 통해서만 변환된다.

실질적으로 프리미티브 값을 프리미티브 객체로 변경하는 것은 `[[ToObject]]` 이고 우리가 사용하는 코드에서 프리미티브값의 프로퍼티에 접근을 수행할 때 실행되는 추상 오퍼레이션은 `[[GetV]]` 이다. `[[GetV]]` 는 프리미티브 값의 프로퍼티에 접근할 때 수행되는 오퍼레이션으로 대상이 객체가 아니면 동일한 타입의 프리미티브 객체를 생성해서 프로퍼티를 빌려 쓰게 해준다. 이 오퍼레이션에서도 물론 `[[ToObject]]` 를 사용한다.

```
1. Assert: IsPropertyKey(P) is true.
2. Let O be ? ToObject(V).
3. Return ? O.[[Get]](P, V).
```

P는 접근할 프로퍼티이고 V는 프리미티브 값 O는 새로 만들어질 프리미티브 객체이다. 접근할 프로퍼티의 키가 정상적인 키인지만 확인하고 `[[ToObject]]` 를 이용해 변환을 한 뒤 생성된 O에 `[[Get]]` 이라는 추상 오퍼레이션을 수행하는데 이 오퍼레이션은 객체의 프로퍼티에 접근할 때 수행되는 오퍼레이션이다. 프리미티브 값을 통해 객체를 만들었으니 정상적으로 객체의 프로퍼티에 접근하는것이다. 생각보다 단출한 작업이 아닐 수 없다. 프리미티브 객체로의 형 변환이라고 했지만 그건 표면적인 의미이고 실제로는 프리미티브 객체를 생성해서 사용한 뒤 제거하는 작업이다. 상단의 자바스크립트 코드에서 whoAmI란 메서드를 실행할때 생성된 객체는 whoAmI 메서드 실행이 종료되면 사라진다. 즉 기존의 프리미티브 값은 여전히 그냥 그대로 변화가 없다.


### 정리

이렇게 스펙을 토대로 프리미티브를 한번 정리해봤다. 앞으로 종종 스펙의 한 부분을 떼어서 정리해보는 내용으로 연재를 할까 한다. 확실히 정해진 건 아니지만 다음엔 스트릭트 모드에 관해 쓸 가능성이 크다. 뭐 스트릭트 모드도 뻔한 내용이지만 이미 뻔한 내용에 대해 더 자세히 알고자 시작한 일이다. 이 글은 최신 스펙을 기준으로 작성되었다. 예전에 ES5 스펙을 정독했었는데 요즘 최신 스펙들을 보며 참 많은 내용이 바뀌었고 바뀌고 있구나 하는 생각에 감회가 새롭다. 라고 생각이 들면서 앞으로 전체 정독은 하지 말아야지 하는 생각이&#x2026;(?) 앞으로도 ECMAScript는 화이팅 넘치게 바뀌고 개선되고 발전할 예정이다.
