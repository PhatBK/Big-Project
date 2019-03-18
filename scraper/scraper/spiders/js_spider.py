# -*- coding: utf-8 -*-
import scrapy


class JsSpiderSpider(scrapy.Spider):
    name = 'js_spider'
    allowed_domains = ['https://www.fahasa.com/']
    start_urls = ['http://https://www.fahasa.com//']

    def parse(self, response):
        print (response)
