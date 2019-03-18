# -*- coding: utf-8 -*-
import scrapy


class ExampleSpider(scrapy.Spider):
    name = 'example'
    allowed_domains = ['https://thichtruyentranh.com/']
    start_urls = [
        'https://thichtruyentranh.com/',
    ]
    all_queue_link = ['https://thichtruyentranh.com/']

    for i in range(1, 50):
        url_tmp = 'https://thichtruyentranh.com/truyen-moi-nhat/trang.' + str(i) + '.html'
        start_urls.append(url_tmp)

    def parse(self, response):
        data = response.css('div.newsContent')
        for store in data:
            yield {
                'name': store.css('a.tile::text').get(),
                # 'view': store.css('')
            }

        all_link = response.css('div.paging ul li');
        for link in all_link:
            if link.css('li a::attr(href)').get() != None:
                yield {
                    self.all_queue_link.append(link.css('li a::attr(href)').get()),
                }
        x = set(self.all_queue_link)

        print("Danh Sach Link:")
        print(x)
    # print (start_urls)
