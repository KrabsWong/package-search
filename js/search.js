// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$(function() {
    var url = 'http://npm.taobao.org/browse/keyword/{key}?type=json'
    var sendingRequest = false;
    $('#doSearch').click(function() {
        var searchString = $('#keywordsOrName').val();

        /* 避免重复发请求 */
        if(searchString && !sendingRequest) {
            sendingRequest = true;
            $('#loading').show();
            $.getJSON(url.replace(/\{key\}/g, searchString), function(data) {
                sendingRequest = false;
                renderPage(data);
                $('#loading').hide();
            });
        }
    });
});

/* 处理结果, 渲染模板 */
function renderPage(data) {
    var dataObj = {
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

    var compiled = dust.compile($('#page-tpl').val(), 'result');
    dust.loadSource(compiled);
    dust.render('result', dataObj, function(err, out) {
        $('#result').html(out);
    });
}