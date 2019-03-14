# -*- coding: utf-8 -*-
import scrapy


class ExampleSpider(scrapy.Spider):
    name = 'example'
    allowed_domains = ['http://quotes.toscrape.com/tag/humor/']
    # start_urls = ['http://quotes.toscrape.com/tag/humor/']
    start_urls = [
        'https://thichtruyentranh.com/',
        # 'https://thichtruyentranh.com/truyen-moi-nhat/trang.2.html',
        # 'https://thichtruyentranh.com/truyen-moi-nhat/trang.3.html',
        # 'https://thichtruyentranh.com/truyen-moi-nhat/trang.4.html',
        # 'https://thichtruyentranh.com/truyen-moi-nhat/trang.5.html',
        # 'https://thichtruyentranh.com/truyen-moi-nhat/trang.6.html',
    ]
    total_link = 0
    for i in range(1, 245):
        url_tmp = 'https://thichtruyentranh.com/truyen-moi-nhat/trang.' + str(i) + '.html'
        start_urls.append(url_tmp)

    def parse(self, response):
        data = response.css('div.newsContent')
        for store in data:
            yield {
                'name': store.css('a.tile::text').get(),
            }

        all_link = response.css('div.paging ul li');
        # print(all_link)
        queue_all_link = [];
        for link in all_link:
            yield {
                queue_all_link.append(link.css('li a::attr(href)').get())
            }
        total_link = len(queue_all_link)
        print(queue_all_link)
        # next_page = response.css().get()
        # if next_page is not None:
        #     yield response.follow(next_page, self.parse)

    print(total_link)


    # def parse(self, response):
    #     for quote in response.css('div.quote'):
    #         yield {
    #             'text': quote.css('span.text::text').get(),
    #             'author': quote.xpath('span/small/text()').get(),
    #         }
    #
    #     next_page = response.css('li.next a::attr("href")').get()
    #     if next_page is not None:
    #         yield response.follow(next_page, self.parse)
