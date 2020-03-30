---
layout: post
title:  "웹 기술로 구현하는 Adaptive HTTP Streaming"
date:   2017-09-18 13:58:08
categories: frontend, javascript
---

![웹 기술로 구현하는 Adaptive HTTP Streaming](http://image.toast.com/aaaadh/alpha/2017/techblog/atswithwebtechnology.png)

한국은 물론 세계적으로 엄청난 양의 동영상 콘텐츠가 소비되고 있다. 플래시가 대세였던 웹 동영상 기술이 점차 표준 기술인 HTML5 비디오로 전환되었고 요즘은 대부분의 동영상 서비스는 HTML5를 기반으로 서비스되고 있다. 동영상 기술은 점차 고도화되어 네트워크 환경에 따른 최적의 동영상 품질을 스트리밍해 버퍼링없는 서비스를 제공하기 위해 여러 방법들이 모색되었고 그중 하나가 새로 프로토콜을 만드는 대신 기존의 HTTP를 이용해 구현하는 Adaptive HTTP Streaming이다.

## Adaptive HTTP Streaming이 무엇인가?

Adaptive HTTP Streaming은 말 그대로 적응형 스트리밍이다. 사용자의 네트워크 상태에 적응(반응)해서 스트리밍을 하는 것이 이 기술의 주목표다. 비슷한 기술로는 RTSP/RTMP Streaming이 있지만, HTTP를 이용한 기술이 아니기 때문에 서비스를 유지하려면 추가적인 비용과 작업이 필요했다. 일반적으로 우리가 사용했던 스트리밍은 Progressive download(이하 PD)로 동영상 소스가 한번 선택되면 해당 콘텐츠를 끝까지 다운로드하면서 플레이를 해나가는 방식이다. HTML5 비디오에서도 기본적으로 PD의 형태로 사용할 수 있다.

![Progressive Download workflow](https://1n469r2k28cd3i0ovv1yqnaz-wpengine.netdna-ssl.com/wp-content/uploads/drupal/progressive_download.png)

이미지 출처: https://www.jwplayer.com/blog/what-is-video-streaming/

PD의 단점은 한가지 해상도의 동영상 소스가 선택되어 다운로드해나가는 방식이다 보니 네트워크 상황에 따라서 사용자는 버퍼링을 만날 수 있게 되고 이후 네트워크 상황이 좋아지지 않는다면 지속해서 버퍼링을 만나게 될 수밖에 없는 것이다. Adaptive Streaming은 바로 이 문제를 해결하기 위해 만들어졌다. 아이디어는 이렇다. 동영상 콘텐츠를 다양한 해상도로 인코딩해 저장해두고 데이터 단위도 동영상 콘텐츠 하나로 저장하는 게 아니라 잘게 쪼개 저장해둔다. 그리고 사용자가 동영상을 플레이할 때 네트워크 상황에 따라서 적절한 전략으로 콘텐츠의 소스를 선택해 최적의 스트리밍 서비스를 제공하는 것이다. 다양한 소스로 인코딩이 되어있으니 상황에 따라 선택할 수 있고 큰 파일 하나가 아닌 잘게 쪼개진 데이터들을 하나씩 다운로드하는 방식이라 다음 데이터를 다른 퀄리티로 쉽게 교체할 수 있게 된다. 예를 들면 현재 사용자의 네트워크 사정이 좋지 않다면 동영상의 480P 소스를 한 조각씩 스트리밍해주고 상황이 나아지면 다음 조각으로 그 이상의 해상도를 갖는 소스를 선택해 스트리밍하는 것이다.

![Adaptive Streaming](https://1n469r2k28cd3i0ovv1yqnaz-wpengine.netdna-ssl.com/wp-content/uploads/drupal/rtmp-rtsp-streaming.png)

이미지 출처: https://www.jwplayer.com/blog/what-is-video-streaming/

넷플릭스나 유튜브 동영상을 시청할 때 처음에는 해상도가 좋지 않다가 점점 해상도가 좋아지는 것을 경험했던 적이 있을 것이다. 처음에는 사용자의 네트워크 상태를 판단할 수 없으니 낮은 해상도의 콘텐츠 조각을 내려주다가 네트워크의 품질이 식별되면 그에 따른 해상도로 내려주는 전략을 선택했을 것으로 짐작해볼 수 있다. Adaptive 하게 스트리밍을 하게 되면 서비스를 제공하는 서버의 트래픽을 관리할 수 있는 이점이 있는 것은 물론 사용자 입장에서도 네트워크 데이터 사용을 줄일 수 있는 장점이 있고 버퍼링 없는 동영상 시청이 가능하게 된다. 버퍼링을 감수하고라도 고해상도로 보고자 하는 유저들에게는 UI를 통한 선택권을 줄 수 있다.

## Adaptive Streaming의 흐름

### 서버 파트

Adaptive streaming을 적용하기 위해서는 PD와는 다르게 동영상 스트리밍을 위해 미리 준비해야 할 것들이 더 있다. 하나면 되었던 동영상 파일을 지원 해상도 별로 인코딩을 해둬야 하고 한 개의 파일이 아니다 보니 각 조각난 파일들에 대한 정보를 클라이언트에 제공해줘야 한다. 전반적인 흐름은 아래와 같다.

1.  동영상을 업로드할때 파일을 작은 조각(세그먼트)으로 잘라낸다.
2.  세그먼트들은 서비스에 필요에 따라 구분한 대역폭에 대응된 해상도로 인코딩한다. 여기서 해상도 별로 세그먼트의 개수가 늘어난다.
3.  대응되는 해상도별 미디어 세그먼트의 정보등을 담은 파일(Manifest)을 클라이언트에 제공한다.

동영상 파일을 작은 세그먼트로 잘라 낼때는 코덱별로 필요한 도구를 사용하게 되고 동영상의 조각난 세그먼트에 대한 정보를 제공해주는 문서 포맷에는 Apple-HLS와 MPEG-DASH이 있다.

### 클라이언트 파트

웹 클라이언트에서 Adaptive Streaming을 가능하게 하는 표준 기술로는 [Media Source Extensions(MSE)](https://www.w3.org/TR/media-source/) 가 있고 이를 통해 스트리밍 데이터를 플레이어에 전달한다.

1.  클라이언트는 플레이할 동영상의 각 해상도별 세그먼트정보를 담은 Manifest 파일을 서버에게 요청한다.
2.  Manifest 파일을 파싱해 필요한 정보들을 얻은 후 비디오에 대한 정보, 어떤 해상도의 퀄리티들을 사용할 수 있는지 그리고 어디서 해당 세그먼트들을 받을 수있는지(e.g. CDN URL)를 파악한다.
3.  클라이언트는 사용자의 네트워크 대역폭을 측정하고 Manifest의 내용에 따라 가장 최적의 비디오 퀄리티를 선택한 뒤 필요한 세그먼트를 다운로드한다.(세그먼트를 다운로드하면서 다시 대역폭 측정)
4.  다운로드한 세그먼트의 데이터를 MSE 버퍼에 제공한다.
5.  MSE는 데이터를 디코딩하고 비디오객체에 제공해 플레이한다.(goto 3)

## Apple-HLS, MPEG-DASH

Adaptive HTTP Streaming을 제공하기 위한 Manifest 포맷으로 대표적인 것은 애플에서 독자적으로 만든 [HLS](https://developer.apple.com/streaming/)와 Mpeg에서 표준화한 [DASH](http://mpeg.chiariglione.org/standards/mpeg-dash)가 있다. HLS와 DASH는 동영상 스트리밍을 위한 콘텐츠 정보를 담고 있는 Manifest에 대한 스펙으로 일종의 프로토콜이라고 생각하면 된다. 장단이 있는데 HLS보다는 DASH가 더 확장성이 있고 열려있는 구조다 보니 DASH를 선호한다.

### Apple-HLS

맥 제품군을 대상으로 개발된 포맷으로 맥용 사파리와 모바일 사파리에서는 네이티브로 지원하고 HTML5 비디오 소스로 HLS Manifest 파일을 직접 사용해 동영상을 스트리밍할 수 있다. 애플 벤더 위주의 포맷이다 보니 다양한 기종에 대한 서포트는 부족하지만 Microsoft Edge에서도 네이티브로 내장하게 됬고 안드로이드 기종의 브라우저들도 지원하고 있다. 네이티브로 HLS가 지원되다 보니 소스로 HLS Manifest를 사용하면 별다른 작업 없이 Adaptive 한 동영상 스트리밍이 동작한다. 하지만 이런 네이티브 구현은 서비스에서 전략적으로 스트리밍을 제어할 수 없다는 단점이 있다. 얼마전까지 미디어 컨테이너를 MP2TS만 사용하도록 스펙에서 제한되었는데 MP2TS 컨테이너는 패킷 헤더로 인해 세그먼트의 크기가 증가할수록 헤더에 의한 오버헤드가 커지는 문제가 있었고 코덱의 브라우저 호환성에도 문제가 있었다. 특히 크롬에서 MP2TS를 지원하지 않아 크롬에서 정상적으로 플레이하려면 디먹싱(demux)을 통해 mp4로 변환해야 했다. 2016년부터는 HLS에서도 MP4 컨테이너를 사용할 수 있게 되었다. HLS는 Manifest로 mp3 음원 목록을 만들때 사용하던 M3U8 플레이리스트를 이용한다. m3u8이란 확장에 제한이 있는 형식으로 컨텐츠의 종류를 서술하다 보니 메인 m3u8과 서브 m3u8구조로 나눠 컨텐츠의 종류와 세그먼트 정보를 표현한다.

-   Apple에서 개발
-   사파리나 특정 브라우저에서는 HTML5 Video의 미디어 소스로 바로 HLS스트리밍을 사용할 수 있다.
-   모바일 사파리에서는 MSE를 지원하지 않아 HLS외엔 사용이 불가능
-   미디어 컨테이너 포맷: mp2ts, mp4(2016)
-   Manifest로 m3u8을 사용

```m3u8
    #EXTM3U
    #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=200000, RESOLUTION=720x480
    http://ALPHA.mycompany.com/lo/prog_index.m3u8
    #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=200000, RESOLUTION=720x480
    http://BETA.mycompany.com/lo/prog_index.m3u8
    
    #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=500000, RESOLUTION=1920x1080
    http://ALPHA.mycompany.com/md/prog_index.m3u8
    #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=500000, RESOLUTION=1920x1080
    http://BETA.mycompany.com/md/prog_index.m3u8
    ....중략....
```

### Mpeg-DASH

MPEG과 ISO에 의해 비준된 표준 포맷이다. 특정 벤더에서 독자적으로 개발한 스펙이 아닌 말 그대로 표준이다. 벤더기반이 아니다 보니 네이티브에서 지원하는 브라우저는 아직 없어 특별한 작업 없이 HTML5 비디오에 바로 소스로 사용할 수 있는 브라우저는 없다. 이후 설명할 MSE를 통해 서비스가 원하는 대로 Adaptive 한 스트리밍을 직접 구현해 줘야 한다. 주요 특징은 미디어 포맷에 제한이 없으며 Manifest인 Media Presentation Description(MPD)은 XML을 기반으로 만들어져 메인 콘텐츠 외에 광고 등을 삽입할 수 있을 정도로 표현력이 풍성하다. 그 풍부한 표현력 덕에 m3u8와 달리 한 개의 Manifest 파일로 모든 정보를 담을 수 있다.

-   MPEG, ISO 비준 표준
-   Dash는 MSE를 이용해 브라우저의 네이티브 재생기능을 이용할 수 있다.
-   Dash는 미디어 컨테이너 포맷에 제한이 없다.
-   광고의 삽입이 수월하고 자연스럽다(Period 구성)
-   Manifest가 XML로 구성되어 있어 풍성한 표현이 가능해 다양한 정보를 한 개의 MPD로 제공한다. (DRM 정보까지)

```xml
    <?xml version="1.0"?>
    <MPD xmlns="urn:mpeg:dash:schema:mpd:2011" profiles="urn:mpeg:dash:profile:full:2011" minBufferTime="PT1.5S">
        <!-- Ad -->
        <Period duration="PT30S">
            <BaseURL>ad/</BaseURL>
            <!-- Everything in one Adaptation Set -->
            <AdaptationSet mimeType="video/mp2t">
                <!-- 720p Representation at 3.2 Mbps -->
                <Representation id="720p" bandwidth="3200000" width="1280" height="720">
                    <!-- Just use one segment, since the ad is only 30 seconds long -->
                    <BaseURL>720p.ts</BaseURL>
                    <SegmentBase>
                        <RepresentationIndex sourceURL="720p.sidx"/>
                    </SegmentBase>
                </Representation>
                <!-- 1080p Representation at 6.8 Mbps -->
                <Representation id="1080p" bandwidth="6800000" width="1920" height="1080">
                    <BaseURL>1080p.ts</BaseURL>
                    <SegmentBase>
                        <RepresentationIndex sourceURL="1080p.sidx"/>
                    </SegmentBase>
                </Representation>
    ....중략....
```

## MSE(Media Source Extensions)

HLS의 경우 맥용 사파리나 모바일용 사파리에서 바로 미디어 소스로 적용할 수 있지만 DASH일 경우에는 대부분 MSE를 이용해 직접 미디어 소스를 확장한다. 사실 DASH나 HLS는 스트리밍할 미디어 데이터의 정보를 동영상 플레이어에게 전달하는 목적으로 만들어졌기 때문에 실질적으로 플레이에 관여하는 부분은 아니다. MSE는 DASH 혹은 HLS Manifest를 통해 필요한 미디어 정보들을 얻은 다음 실질적으로 미디어 조각들을 웹상에서 HTML5 비디오를 통해 플레이할때 사용된다. (물론 사파리에서는 HLS Manifest를 그대로 소스로 사용할 수 있다) MSE는 HTML5의 비디오로 동영상을 재생할 때 소스를 제공할 목적으로 사용하던 `source` 태그 대신 HTMLMediaElement을 이용해 개발자가 직접 새로운 미디어 소스를 정의할 수 있게 해주는 인터페이스이다. 개발자가 플레이될 동영상의 데이터를 HTTP를 통해 받은 후 SourceBuffer 객체를 이용해 직접 HTMLMediaElement에 미디어 버퍼 청크를 제공하는 방법으로 개발한다. 동영상을 플레이할 때 HTML5 비디오가 필요한 데이터들을 개발자가 관여해서 제공할 수 있게 된 것이다. MSE 구현 코드를 보기 전에 간단하게 주요 개념을 몇 가지를 살펴보자.

### 세그먼트

세그먼트는 인코딩된 동영상 데이터의 작은 조각이다. 이 조각에 대한 정보는 DASH나 HLS를 통해 얻어오고 한 조각 한 조각 모와서 유저가 동영상을 볼 수 있도록 플레이어에 전달하는 것이다. 세그먼트는 두 가지 종류의 세그먼트가 있다. **Initialization Segment** (초기화 세그먼트) 와 **Media Segment** (미디어 세그먼트) 다. **초기화 세그먼트** 는 실제 동영상 정보를 담고 있는 미디어 세그먼트의 시퀀스를 디코딩하는데 필요한 정보를 담고 있는데 코덱 초기화 데이터, 트랙 ID, 타임스탬프 오프셋 등의 정보를 포함한다. **미디어 세그먼트** 는 패킷화된 그리고 자신이 플레이되어야 할 미디어 타임라인상의 타임스탬프 정보가 포함된 실제 동영상 데이터다. 미디어 세그먼트는 초기화 세그먼트의 정보를 토대로 자신의 위치를 알기 때문에 미디어 세그먼트를 순차적으로 플레이어에 제공하지 않아도 플레이되어야 할 위치에서 플레이 되게 된다. 반대로 초기화 세그먼트가 없다면 미디어 세그먼트의 데이터를 아무리 플레이어에 제공해도 정상적으로 플레이가 되지 않는다.

### MediaSource 객체, SourceBuffer 객체

MediaSource는 HTMLMediaElement의 미디어 데이터 소스를 나타낸다. 동영상 플레이어에서 플레이되고 있는 한 종류의 미디어라고 이해하면 된다. SourceBuffer를 이용해 MediaSource에 미디어 세그먼트를 전달해주고 HTMLMediaElement(Video)는 플레이하면서 필요한 데이터를 MediaSource로 부터꺼내와 사용한다.
구조적으로 HTMLMediaELement가 MediaSource를 사용하고 MediaSource는 SourceBuffer를 소유하고 사용한다.

![미디어 소스 파이프라인](https://www.w3.org/TR/2015/CR-media-source-20150331/pipeline_model.png)
이미지출처: https://www.w3.org/TR/media-source/)

## HTML5 Video와 MSE 연동하기

구글링을 해보면 MSE에 대한 자료가 몇 가지가 있는데 나온 지 얼마 되지 않은 스펙이다 보니 MSE를 제대로 이해하기 위해서는 [W3C스펙문서](https://www.w3.org/TR/media-source/)를 보는것이 가장 확실한 방법인 것 같다. 다행히 스펙 내용이 적은 편이라 읽기 수월하다. MSE의 인터페이스 사용 방법만을 알고자 할 때는 알고리즘 부분은 생략해도 된다. 스펙 문서의 전체적인 내용은 맨 하단의 예제코드에서 전반적으로 드러나 있다. 이 예제 코드를 옮겨와 한줄 한줄 주석을 달아 설명하고자 하는데 그 전에 몇 가지 중요한 부분만 먼저 살펴본다.

동영상 플레이어 즉 Video(HTMLMediaElement) 객체에 스트리밍 소스를 제공하는 기술인 MSE의 핵심은 MediaSource 다. MediaSource객체를 만들고 Video 객체 연결하는 것이 첫 번째 작업이 된다.

```js
    var mediaSource = new MediaSource();
    video.src = window.URL.createObjectURL(mediaSource);
```

Video와 MediaSource는 Object URL을 통해 연결하게 되는데 window.URL.createObjectURL함수를 사용해 MediaSource 객체의 Object URL을 만든다.
그리고 Video와 연결이 되면 MediaSource 객체는 스트리밍 데이터를 받을 준비가 되었음을 알리는 이벤트 sourceopen을 발생하고 이 이벤트를 시작으로 추가적인 작업을 하게 된다.
MediaSource가 정상적으로 준비가 되면 SourceBuffer 객체를 만든다. 이후 반복적으로 세그먼트를 가져와 SourceBuffer를 통해 스트리밍할 데이터를 Video에 전달한다.

```js
    var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
```

addSourceBuffer는 코덱 정보를 인자로 받아 해당 코덱의 데이터를 디코딩할 수 있는 SourceBuffer객체를 리턴한다.
이후에 서버에서 미디어 세그먼트 정보를 받아와 소스 버퍼에 제공하는 작업은 SourceBuffer객체의 appendBuffer 메서드를 사용한다. Ajax로 미디어 세그먼트 정보를 받아올 때의 response type은 [ArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)을 사용한다.

```js
    var xhr = new XMLHttpRequest;
    xhr.open('get', url);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {
      sourceBuffer.appendBuffer(xhr.response);
    };
    xhr.send();
```

appendBuffer를 사용한 이후에는 MediaSource 내부에서 데이터를 디코딩하는 작업을 수행되며 이때는 새로운 버퍼 데이터가 제공되면 안 된다. 이후 비디오 객체의 progress이벤트등을 이용해 지속해서 버퍼를 받아와 제공하는 작업을 해야 한다.
간략하게 주요 인터페이스를 위주로 흐름을 살펴봤다. 이제 w3c스펙문서 하단에 있는 예제 코드를 주석과 함께 살펴보자.

```html
    <video id="v" autoplay> </video>
    
    <script>
      var video = document.getElementById('v');
    
      // 새로운 MediaSource 만든다.
      var mediaSource = new MediaSource();
    
      // MediaSource가 Video에 연결되어 스트리밍 데이터를 받을 준비가 되면 sourceopen 이벤트가 발생한다.
      mediaSource.addEventListener('sourceopen', onSourceOpen.bind(this, video));
    
      // 비디오 객체에 우리의 MediaSource를 연결해준다.
      video.src = window.URL.createObjectURL(mediaSource);
    
      // 미디어 소스가 오픈되면 실행되는 핸들러다.
      function onSourceOpen(videoTag, e) {
        var mediaSource = e.target;
    
        // 불필요한 상황에서 sourceopen 이벤트가 발생될때를 걸러낸다. sourceBuffer가 있어야한다.
        if (mediaSource.sourceBuffers.length > 0)
            return;
    
        // 미디어 소스에 addSourceBuffer 메서드를 이용해 sourceBuffer를 만든다. 인자는 코덱정보다.
        // 예제코드에서 sourceBuffer는 webm 코덱으로 인코딩된 데이터를 받을 수 있게 된다.
        var sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vorbis,vp8"');
    
        // 비디오 객체의 필요에 따라 버퍼 제공해야 하니 핸들러를 걸어준다.
        videoTag.addEventListener('seeking', onSeeking.bind(videoTag, mediaSource));
        videoTag.addEventListener('progress', onProgress.bind(videoTag, mediaSource));
    
        // 어플리케이션 코드로 초기화 세그먼트를 얻어온다. 물론 이 과정은 비동기 작업이 되겠지만...
        // 초기화혹은 미디어 세그먼트는 ajax 요청시 응답 타입을 "arrayBuffer"로 받아와야 한다.
        var initSegment = GetInitializationSegment();
    
        if (initSegment == null) {
          // 초기화 세그먼트를 못 가져오면 어차피 플레이가 되지 않는다.
          // mediaSource.endOfstream 메서드로 스트림을 종료한다. 이 메서드는 정상적으로 스트림이 종료되었을때도 호출되고
          // 오류로인한 종료일때도 원인을 인자로 넘겨 종료한다. "network" 혹은 "decode"
          mediaSource.endOfStream("network");
          return;
        }
    
        // 초기화 세그먼트를 sourceBuffer에 제공한다.
        // firstAppendHandler 초기화 세그먼트가 정상적으로 sourceBuffer에 들어가고 나면 한번 실행되고 이벤트 핸들러에서 제거된다.
        // 초기화 세그먼트가 들어가고 난 뒤 미디어 세그먼트로 전환하려고 잠깐 사용되는 함수다.
        var firstAppendHandler = function(e) {
          var sourceBuffer = e.target;
          sourceBuffer.removeEventListener('updateend', firstAppendHandler);
    
          // 아래의 함수를 통해 본격적으로 미디어 버퍼를 sourceBuffer에 제공하는 단계로 넘어간다.
          appendNextMediaSegment(mediaSource);
        };
    
        // sourceBuffer는 미디어 데이터를 받으면 해당 데이터를 디코딩하는 작업을 하게 되는데
        // update는 작업이 성공적으로 종료되었을 때 updateend는 성공, 실패 상관없이 종료되었을 때 발생한다.
        // 여기서는 초기화 세그먼트를 제공하고 미디어 세그먼트를 제공하기위해 잠깐 사용된다.
        sourceBuffer.addEventListener('updateend', firstAppendHandler);
        sourceBuffer.appendBuffer(initSegment);
      }
    
    
      // 초기화 세그먼트가 제공된 이후 미디어 세그먼트를 제공하는 함수
      // 첫 실행 이후에는 비디오 객체의 progress 이벤트에 의해 실행된다.
      function appendNextMediaSegment(mediaSource) {
        // MediaSource.readyState는 총 세가지 스테이트를 가질 수 있는데 "open", "closed", "ended"다
        // "open" 이면 현재 미디어 데이터를 처리중에 있고 "ended"는 대기 상태와 동일하다.
        // "closed"인 경우는 더이상 미디어 스트림을 받을 수 없다.
        if (mediaSource.readyState == "closed")
          return;
    
        // 어플리케이션 코드로 더이상 제공할 미디어 세그먼트가 없다면 endOfStream으로 스트리밍을 종료한다.
        if (!HaveMoreMediaSegments()) {
          mediaSource.endOfStream();
          return;
        }
    
        // 동영상 버퍼를 제공하는 과정은 데이터를 디코딩하는 과정을 거쳐야 하므로 시간과 CPU 비용이 든다.
        // 항상 sourceBuffer가 updating 상태인지를 체크하고 새로운 버퍼를 제공해야 한다.
        // updating이 true인 경우 이전 미디어 데이터를 처리하고 있는 중이다.
        if (mediaSource.sourceBuffers[0].updating)
            return;
    
        // 어플리케이션 코드다 다음 미디어 세그먼트를 받아온다.
        var mediaSegment = GetNextMediaSegment();
    
        if (!mediaSegment) {
          // 없으면 에러
          mediaSource.endOfStream("network");
          return;
        }
    
        // 미디어 데이터를 sourceBuffer에 제공한다.
        // MediaSource.readyState가 "ended"인 경우 다시 "open"되면서
        // sourceopen이벤트에 걸려있는 onSourceOpen핸들러가 다시 실행될 수 있으니 대처해야 한다.
        mediaSource.sourceBuffers[0].appendBuffer(mediaSegment);
      }
    
      // seeking 이벤트 핸들러로 시킹된 해당 위치의 미디어 데이터를 제공하는 작업을 수행한다.
      function onSeeking(mediaSource, e) {
        var video = e.target;
    
        // sourceBuffer에서 처리되고 있는 버퍼가 있다면 취소한다.
        if (mediaSource.readyState == "open") {
          mediaSource.sourceBuffers[0].abort();
        }
    
        // 어플리케이션 코드로 비디오 객체에서 현재 동영상이 플레이되는 위치를 읽어 해당 미디어 세그먼트를 준비하게 한다.
        SeekToMediaSegmentAt(video.currentTime);
    
        // MediaSource에 변경된 버퍼를 제공한다.
        appendNextMediaSegment(mediaSource);
      }
    
      // progress 이벤트 핸들러로 플레이될 세그먼트의 데이터를 준비해 sourceBuffer에 제공한다.
      function onProgress(mediaSource, e) {
        appendNextMediaSegment(mediaSource);
      }
    </script>
```

예제코드의 전반적인 흐름을 짧게 요약하면 아래와 같다.

1.  MediaSource의 새 인스턴스를 만들고 비디오 객체와 Object URL로 연결한다.
2.  MediaSource가 준비되면 sourceOpen 이벤트가 발생한다.
3.  MediaSource에서 사용하게될 코덱 데이터를 디코딩할 수 있는 sourceBuffer를 준비한다.
4.  SourceBuffer에 초기화 세그먼트를 제공하고 디코딩이 완료되면 미디어 세그먼트를 제공한다.
5.  이후 progress와 seeking 이벤트 따라 비디오 객체의 타임라인 위치에 해당하는 미디어 세그먼트를 제공한다.

예제 코드는 순수하게 MSE를 사용하는 방법에 대한 예제를 제공하고 있는데 실제 서비스에서는 DASH나 HLS형태의 Manifest를 다운로드하고 파싱해 미디어 정보를 얻어오는 부분이 포함되어야 한다. 그리고 유저의 Bandwidth를 체크해서 적절한 퀄리티를 선택하는 코드도 들어가야할 것이다. 사실 대역폭을 체크해서 최적의 해상도를 선정하는 부분은 생각보다 쉽지 않다. 클라이언트에서 대역폭을 측정해보면 순간순간의 편차가 매우 크기 때문에 (특히 모바일) 이 대역폭 값들을 어떻게 가공해서 사용할지에 대한 방법도 충분한 고려가 필요하다. 보통 [EWMA Control Charts](http://www.itl.nist.gov/div898/handbook/pmc/section3/pmc324.htm) 를 이용해 모수를 추정한다.

## 마치며

웹 브라우저상에서 Adaptive HTTP Streaming을 구현하는 전반적인 기술들을 훑어봤다. 그리고 이제 MSE는 [Encrypted Media Extensions](https://www.w3.org/TR/encrypted-media/) 와 연계하여 DRM까지 커버할 수 있게 되었다. 과거에는 플래시나 실버라이트가 아니면 불가능 했던 일들이 점점 표준 웹기술만으로 가능해지고 있고 이런 웹기술이 나오는 속도는 점점 가속화되고 있다. 앞으로 또 어떤 기술이 나와서 무엇을 가능하게 할지 프론트엔드 개발자로서 두렵지만(?) 기대된다.
