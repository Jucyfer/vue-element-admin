const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  // 注册的时候分配的随机数
  userid: state => state.user.userid,
  avatar: state => state.user.avatar,
  // 真实姓名
  name: state => state.user.name,
  // 公司名称
  com: state => state.user.com,
  // P码
  comId: state => state.user.comId,
  introduction: state => state.user.introduction,
  // 权限（临）
  roles: state => state.user.roles,
  mobile: state => state.user.mobile,
  mail: state => state.user.mail,
  businessCardId: state => state.user.businessCardId,
  position: state => state.user.position,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs,
  questMetaMap: state => state.questCommon.quest_Meta_Map,
  questMap: state => state.questCommon.quest_CN_Map,
  reportViewOnly: state => state.reports.viewOnly,
  strategyCascade: state => state.fund.cascadeOptions,
  strategyMap: state => state.fund.strategyTranslation,
  strategyTableFilter: state => state.fund.strategyFilterArray,
  fundValSourceMap: state => state.fund.sourceType,
  fundValSourceFilter: state => state.fund.sourceTypeFilter,
  fundStatisticMap: state => state.fund.statisticMap,
  employeePositionOptions: state => state.employee.positionOptions,
  employeepositionTranslation: state => state.employee.positionTranslation
}
export default getters
