
export default 
`
<div class="page-index">
<div class="container">
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
<ui-container :isShow="isCalendarShow" v-on:onmaskevent="onContainerHide">
  <div class="calendar-wrapper-box">
    <div class="box-hd">
      <span class="fl icon-back js_back " @click="preMonth" ></span>
      <span class="fr icon-next js_next" @click="nextMonth"></span>
    </div>
    <ui-calendar  v-on:dayclick="onDayClick" :selectedDate="selectedDate" :displayMonthNum="displayMonthNum" :displayTime="displayTime"  ></ui-calendar>
  </div>
</ui-container>
</div>
`
