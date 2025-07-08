const axios = require('axios');

class DoubanService {
  constructor() {
    this.baseUrl = 'https://m.douban.com/rexxar/api/v2';
    
    // 创建axios实例
    this.api = axios.create({
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
        'Referer': 'https://m.douban.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin'
      }
    });

    // 电影榜单配置 - 4个大类，每个大类下有5个小类
    this.movieCategories = {
      '热门电影': {
        '全部': { category: '热门', type: '全部' },
        '华语': { category: '热门', type: '华语' },
        '欧美': { category: '热门', type: '欧美' },
        '韩国': { category: '热门', type: '韩国' },
        '日本': { category: '热门', type: '日本' }
      },
      '最新电影': {
        '全部': { category: '最新', type: '全部' },
        '华语': { category: '最新', type: '华语' },
        '欧美': { category: '最新', type: '欧美' },
        '韩国': { category: '最新', type: '韩国' },
        '日本': { category: '最新', type: '日本' }
      },
      '豆瓣高分': {
        '全部': { category: '豆瓣高分', type: '全部' },
        '华语': { category: '豆瓣高分', type: '华语' },
        '欧美': { category: '豆瓣高分', type: '欧美' },
        '韩国': { category: '豆瓣高分', type: '韩国' },
        '日本': { category: '豆瓣高分', type: '日本' }
      },
      '冷门佳片': {
        '全部': { category: '冷门佳片', type: '全部' },
        '华语': { category: '冷门佳片', type: '华语' },
        '欧美': { category: '冷门佳片', type: '欧美' },
        '韩国': { category: '冷门佳片', type: '韩国' },
        '日本': { category: '冷门佳片', type: '日本' }
      }
    };

    // 剧集榜单配置 - 2个大类
    this.tvCategories = {
      '最近热门剧集': {
        '综合': { category: 'tv', type: 'tv' },
        '国产剧': { category: 'tv', type: 'tv_domestic' },
        '欧美剧': { category: 'tv', type: 'tv_american' },
        '日剧': { category: 'tv', type: 'tv_japanese' },
        '韩剧': { category: 'tv', type: 'tv_korean' },
        '动画': { category: 'tv', type: 'tv_animation' },
        '纪录片': { category: 'tv', type: 'tv_documentary' }
      },
      '最近热门综艺': {
        '综合': { category: 'show', type: 'show' },
        '国内': { category: 'show', type: 'show_domestic' },
        '国外': { category: 'show', type: 'show_foreign' }
      }
    };
  }

  /**
   * 获取电影榜单数据
   * @param {string} category - 榜单类别
   * @param {string} type - 榜单类型
   * @param {number} start - 起始位置
   * @param {number} limit - 数量限制
   * @returns {Promise<Object>} 榜单数据
   */
  async getMovieRanking(category = '热门', type = '全部', start = 0, limit = 20) {
    try {
      console.log(`获取电影榜单: ${category} - ${type}, start: ${start}, limit: ${limit}`);

      // 构建请求参数，包含category和type信息
      const params = {
        start,
        limit
      };

      // 根据不同的category和type添加特定参数
      if (category !== '热门' || type !== '全部') {
        // 对于非默认的榜单，可能需要不同的参数
        if (type !== '全部') {
          params.type = type;
        }
        if (category !== '热门') {
          params.category = category;
        }
      }

      let response;
      try {
        response = await this.api.get('/subject/recent_hot/movie', {
          params
        });
      } catch (apiError) {
        console.log('豆瓣API调用失败，使用模拟数据:', apiError.message);
        // 如果豆瓣API调用失败，使用模拟数据
        const mockData = this.getMockMovieData();
        mockData.isMockData = true;
        mockData.mockReason = 'API调用失败';
        response = { data: mockData };
      }

      if (response.data) {
        // 处理豆瓣移动端API的响应格式
        let items = response.data.items || response.data.subjects || [];
        let categories = response.data.categories || [];

        // 如果没有获取到真实数据，使用模拟数据
        let isMockData = response.data.isMockData || false;
        let mockReason = response.data.mockReason || '';

        if (items.length === 0) {
          console.log('API返回空数据，使用模拟数据');
          const mockData = this.getMockMovieData();
          items = mockData.items || [];
          isMockData = true;
          mockReason = 'API返回空数据';
        }

        // 如果没有获取到categories，使用默认的电影分类
        if (categories.length === 0) {
          categories = [
            {category: "热门", selected: true, type: "全部", title: "热门"},
            {category: "最新", selected: false, type: "全部", title: "最新"},
            {category: "豆瓣高分", selected: false, type: "全部", title: "豆瓣高分"},
            {category: "冷门佳片", selected: false, type: "全部", title: "冷门佳片"},
            {category: "热门", selected: false, type: "华语", title: "华语"},
            {category: "热门", selected: false, type: "欧美", title: "欧美"},
            {category: "热门", selected: false, type: "韩国", title: "韩国"},
            {category: "热门", selected: false, type: "日本", title: "日本"}
          ];
        }

        // 根据请求的category和type更新selected状态
        categories = categories.map(cat => ({
          ...cat,
          selected: cat.category === category && cat.type === type
        }));

        return {
          success: true,
          data: {
            items: items.slice(0, limit),
            total: response.data.total || items.length,
            start,
            limit,
            category,
            type,
            categories,
            isMockData,
            ...(isMockData && {
              mockReason,
              notice: response.data.notice || "⚠️ 这是模拟数据，非豆瓣实时数据"
            })
          }
        };
      }

      return {
        success: false,
        data: null,
        message: '未获取到数据'
      };

    } catch (error) {
      console.error('获取电影榜单失败:', error.message);
      throw new Error(`获取电影榜单失败: ${error.message}`);
    }
  }

  /**
   * 获取电视剧榜单数据
   * @param {string} category - 榜单类别
   * @param {string} type - 榜单类型
   * @param {number} start - 起始位置
   * @param {number} limit - 数量限制
   * @returns {Promise<Object>} 榜单数据
   */
  async getTvRanking(category = 'tv', type = 'tv', start = 0, limit = 20) {
    try {
      console.log(`获取电视剧榜单: ${category} - ${type}, start: ${start}, limit: ${limit}`);

      // 构建请求参数，包含category和type信息
      const params = {
        start,
        limit
      };

      // 根据不同的category和type添加特定参数
      if (category !== 'tv' || type !== 'tv') {
        if (type !== 'tv') {
          params.type = type;
        }
        if (category !== 'tv') {
          params.category = category;
        }
      }

      let response;
      try {
        response = await this.api.get('/subject/recent_hot/tv', {
          params
        });
      } catch (apiError) {
        console.log('豆瓣TV API调用失败，使用模拟数据:', apiError.message);
        const mockData = this.getMockTvData();
        mockData.isMockData = true;
        mockData.mockReason = 'API调用失败';
        response = { data: mockData };
      }

      if (response.data) {
        // 处理豆瓣移动端API的响应格式
        let items = response.data.items || response.data.subjects || [];
        let categories = response.data.categories || [];

        // 如果没有获取到真实数据，使用模拟数据
        let isMockData = response.data.isMockData || false;
        let mockReason = response.data.mockReason || '';

        if (items.length === 0) {
          console.log('TV API返回空数据，使用模拟数据');
          const mockData = this.getMockTvData();
          items = mockData.items || [];
          isMockData = true;
          mockReason = 'API返回空数据';
        }

        // 如果没有获取到categories，使用默认的电视剧分类
        if (categories.length === 0) {
          categories = [
            {category: "tv", selected: true, type: "tv", title: "综合"},
            {category: "tv", selected: false, type: "tv_domestic", title: "国产剧"},
            {category: "show", selected: false, type: "show", title: "综艺"},
            {category: "tv", selected: false, type: "tv_american", title: "欧美剧"},
            {category: "tv", selected: false, type: "tv_japanese", title: "日剧"},
            {category: "tv", selected: false, type: "tv_korean", title: "韩剧"},
            {category: "tv", selected: false, type: "tv_animation", title: "动画"},
            {category: "tv", selected: false, type: "tv_documentary", title: "纪录片"}
          ];
        }

        // 根据请求的category和type更新selected状态
        categories = categories.map(cat => ({
          ...cat,
          selected: cat.category === category && cat.type === type
        }));

        return {
          success: true,
          data: {
            items: items.slice(0, limit),
            total: response.data.total || items.length,
            start,
            limit,
            category,
            type,
            categories,
            isMockData,
            ...(isMockData && {
              mockReason,
              notice: response.data.notice || "⚠️ 这是模拟数据，非豆瓣实时数据"
            })
          }
        };
      }

      return {
        success: false,
        data: null,
        message: '未获取到数据'
      };

    } catch (error) {
      console.error('获取电视剧榜单失败:', error.message);
      throw new Error(`获取电视剧榜单失败: ${error.message}`);
    }
  }



  /**
   * 获取指定类别的电影数据
   */
  async getSpecificMovieData(category, type, start, limit) {
    // 这里可以根据需要实现特定类别的数据获取逻辑
    // 目前先返回默认数据
    const response = await this.api.get('/subject/recent_hot/movie', {
      params: { start, limit }
    });

    return {
      success: true,
      data: {
        items: response.data.items || [],
        total: response.data.total || 0,
        start,
        limit,
        category,
        type,
        categories: response.data.categories || []
      }
    };
  }

  /**
   * 获取指定类别的电视剧数据
   */
  async getSpecificTvData(category, type, start, limit) {
    // 这里可以根据需要实现特定类别的数据获取逻辑
    // 目前先返回默认数据
    const response = await this.api.get('/subject/recent_hot/tv', {
      params: { start, limit }
    });
    
    return {
      success: true,
      data: {
        items: response.data.items || [],
        total: response.data.total || 0,
        start,
        limit,
        category,
        type,
        categories: response.data.categories || []
      }
    };
  }

  /**
   * 获取支持的电影类别
   */
  getMovieCategories() {
    return this.movieCategories;
  }

  /**
   * 获取支持的电视剧类别
   */
  getTvCategories() {
    return this.tvCategories;
  }

  /**
   * 获取所有支持的类别
   */
  getAllCategories() {
    return {
      movie: this.getMovieCategories(),
      tv: this.getTvCategories()
    };
  }

  /**
   * 获取电影特定大类下的小类
   */
  getMovieSubCategories(mainCategory) {
    return this.movieCategories[mainCategory] || {};
  }

  /**
   * 获取剧集特定大类下的小类
   */
  getTvSubCategories(mainCategory) {
    return this.tvCategories[mainCategory] || {};
  }

  /**
   * 获取模拟电影数据
   */
  getMockMovieData() {
    return {
      notice: "⚠️ 这是模拟数据，非豆瓣实时数据",
      items: [
        {
          id: "1292052",
          title: "肖申克的救赎",
          rating: { value: 9.7 },
          year: "1994",
          directors: ["弗兰克·德拉邦特"],
          actors: ["蒂姆·罗宾斯", "摩根·弗里曼"]
        },
        {
          id: "1291546",
          title: "霸王别姬",
          rating: { value: 9.6 },
          year: "1993",
          directors: ["陈凯歌"],
          actors: ["张国荣", "张丰毅", "巩俐"]
        },
        {
          id: "1295644",
          title: "阿甘正传",
          rating: { value: 9.5 },
          year: "1994",
          directors: ["罗伯特·泽米吉斯"],
          actors: ["汤姆·汉克斯", "罗宾·怀特"]
        }
      ],
      total: 3
    };
  }

  /**
   * 获取模拟电视剧数据
   */
  getMockTvData() {
    return {
      notice: "⚠️ 这是模拟数据，非豆瓣实时数据",
      items: [
        {
          id: "26794435",
          title: "请回答1988",
          rating: { value: 9.7 },
          year: "2015",
          directors: ["申元浩"],
          actors: ["李惠利", "朴宝剑", "柳俊烈"]
        },
        {
          id: "1309163",
          title: "大明王朝1566",
          rating: { value: 9.7 },
          year: "2007",
          directors: ["张黎"],
          actors: ["陈宝国", "黄志忠", "王庆祥"]
        },
        {
          id: "1309169",
          title: "亮剑",
          rating: { value: 9.3 },
          year: "2005",
          directors: ["陈健", "张前"],
          actors: ["李幼斌", "何政军", "张光北"]
        }
      ],
      total: 3
    };
  }
}

module.exports = DoubanService;
