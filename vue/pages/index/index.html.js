
export default 
`<div class="container">
  <div class="c-row search-line" data-flag="start" @click="showCitylist">
    <div class="c-span3">
      出发</div>
    <div class="c-span9 js-start search-line-txt">
      {{cityStartName}}</div>
  </div>
  <div class="c-row search-line" data-flag="arrive" @click="showCitylist">
    <div class="c-span3">
      到达</div>
    <div class="c-span9 js-arrive search-line-txt">
      {{cityArriveName}}</div>
  </div>
  <div class="c-row search-line" data-flag="arrive" @click="showCalendar">
    <div class="c-span3">
      出发日期</div>
    <div class="c-span9 js-arrive search-line-txt">
      {{calendarSelectedDateStr}}</div>
  </div>
  <div class="c-row " data-flag="arrive">
    <span class="btn-primary full-width js_search_list" @click="goList" >查询</span>
  </div>
</div>
`
