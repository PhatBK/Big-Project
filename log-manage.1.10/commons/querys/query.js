// thống kê cho first load
`
GET first-load-event/_search
{
  "query": {
    "match_all": {}
  }
}

GET first-load-event/_search
{
  
}
GET first-load-event/_search
{
  
}





POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_day": {
      "terms": {
        "field": "day.keyword"
      },
      "aggs": {
        "Max_secondsToLoad": {
          "max": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_day": {
      "terms": {
        "field": "day.keyword"
      },
      "aggs": {
        "Min_secondsToLoad": {
          "min": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_day": {
      "terms": {
        "field": "day.keyword"
      },
      "aggs": {
        "AVG_secondsToLoad": {
          "avg": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_IP": {
      "terms": {
        "field": "ip_public.keyword"
      },
      "aggs": {
        "Max_secondsToLoad": {
          "max": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_IP": {
      "terms": {
        "field": "day.keyword"
      },
      "aggs": {
        "Max_secondsToLoad": {
          "max": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_VideoSRC": {
      "terms": {
        "field": "src_video.keyword"
      },
      "aggs": {
        "Max_secondsToLoad": {
          "max": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_VideoSRC": {
      "terms": {
        "field": "src_video.keyword"
      },
      "aggs": {
        "Min_secondsToLoad": {
          "min": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_VideoSRC": {
      "terms": {
        "field": "src_video.keyword"
      },
      "aggs": {
        "avg_secondsToLoad": {
          "avg": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_hour": {
      "terms": {
        "field": "day.keyword"
      },
      "aggs": {
        "avg_secondsToLoad": {
          "avg": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
POST first-load-event/_search
{
  "size": 0,
  "aggs": {
    "group_by_hour": {
      "terms": {
        "field": "hour.keyword"
      },
    "aggs": {
        "sum_secondsToLoad": {
          "sum": {
            "field": "secondsToLoad"
          }
        }
      }
    }
  }
}
GET first-load-event/_search
{
  "size": 0, 
  "aggs": {
    "MAX_SecondLoad": {
      "max": {
        "field": "secondsToLoad"
      }
    }
  }
}
GET first-load-event/_search
{
  "size": 0,
  "aggs": {
    "MIN_SecondLoad": {
      "min": {
        "field": "secondsToLoad"
      }
    }
  }
}
GET first-load-event/_search
{
  "size": 0,
  "aggs": {
    "avg_secondsToLoad": {
      "avg": {
        "field": "secondsToLoad"
      }
    }
  }
}
GET first-load-event/_search
{
  "size": 0,
  "aggs": {
    "avg_secondsToLoad": {
      "avg": {
        "field": "secondsToLoad"
      }
    },
    "min_secondsToLoad": {
      "min": {
        "field": "secondsToLoad"
      }
    },
    "max_secondsToLoad": {
      "max": {
        "field": "secondsToLoad"
      }
    },
    "sum_secondsToLoad": {
      "sum": {
        "field": "secondsToLoad"
      }
    }
  }
}
`