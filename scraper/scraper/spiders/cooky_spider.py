# -*- coding: utf-8 -*-
import scrapy


class CookySpiderSpider(scrapy.Spider):
    name = 'cooky_spider'
    allowed_domains = [
        'https://www.cooky.vn/'
    ]
    start_urls = [
        'https://www.cooky.vn/cach-lam',
        'https://www.cooky.vn/cach-lam?st=2',
    ]
    all_queue_links = []
    all_queue_name = []

    def parse(self, response):
        print ("Begin Crawl...")
        print (response)
        datas = response.css('div.item-header')
        # print(datas)
        for data in datas:
            yield {
                self.all_queue_name.append(data.css('div.title h2 a::text').get()),
                self.all_queue_links.append(data.css('div.title h2 a::attr(href)').get()),
            }
        print ("All Link:")
        print(self.all_queue_links)
        print ("All Namw")
        print (self.all_queue_name)

