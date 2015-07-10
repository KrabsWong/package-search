// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

let requestURL = 'http://npm.taobao.org/browse/keyword/{key}?type=json';
let packageURL = 'http://npm.taobao.org/package/{key}';

/* 获取配置信息 */
chrome.storage.sync.get({
    searchURL: '',
    linkURL: ''
}, function(items) {
    requestURL = items.searchURL || requestURL;
    packageURL = items.linkURL || packageURL;
});

$(function() {
    let sendingRequest = false;
    $('#doSearch').click(function() {
        let searchString = $('#keywordsOrName').val();

        /* 避免重复发请求 */
        if(searchString && !sendingRequest) {
            sendingRequest = true;
            $('#loading').show();

            /* 检测请求超时 */
            var timeoutChecking = setTimeout(function() {
                $('#timeout-tips').show();
            }, 5000);

            $.getJSON(requestURL.replace(/\{key\}/g, searchString), function(data) {
                sendingRequest = false;
                renderPage(searchString, data);

                /* 隐藏loading层 */
                $('#loading').hide();
                clearInterval(timeoutChecking);
            });
        }
    });
});

/* 处理结果, 渲染模板 */
function renderPage(searchString, data) {
    data.keywords && data.keywords.forEach(function(item) {
        item.url = packageURL.replace(/\{key\}/g, searchString);
    });

    data.packages && data.packages.forEach(function(item) {
        item.url = packageURL.replace(/\{key\}/g, searchString);
    });

    let dataObj = {
        hasResult: data.keywords.length || data.packages.length || data.match,
        hasMatch: data.match,
        hasKeywords: data.keywords.length > 0,
        hasPackages: data.packages.length > 0,
        keywordsActive: data.keywords.length > 0,
        packagesActive: data.keywords.length == 0 && data.packages.length > 0,
        match: data.match,
        packages: data.packages,
        keywords: data.keywords,
        packagesCount: data.packages.length,
        keywordsCount: data.keywords.length
    };

    let compiled = dust.compile($('#page-tpl').val(), 'result');
    dust.loadSource(compiled);
    dust.render('result', dataObj, function(err, out) {
        $('#result').html(out);
    });
}