// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
"use strict";

$(function() {
    /* 回填数据 */
    chrome.storage.sync.get({
        searchURL: '',
        linkURL: ''
    }, function(items) {
        $('#npmSearchURL').val(items.searchURL);
        $('#npmLinkURL').val(items.linkURL);
    });

    /* 事件绑定 */
    $('#set').click(function() {
        var npmSearchURLData = $('#npmSearchURL').val();
        var npmLinkURLData = $('#npmLinkURL').val();

        if (!npmSearchURLData || !npmLinkURLData) {
            $('#status').removeClass('text-success').addClass('text-danger').html('不填数据昂?!!');
            return false;
        }

        chrome.storage.sync.set({
            searchURL: npmSearchURLData,
            linkURL: npmLinkURLData
        }, function() {
            $('#status').removeClass('text-danger').addClass('text-success').html('设置成功!');
            setTimeout(function() {
                $('#status').html('');
            }, 750);
        });
    });

    $('#reset').click(function() {
        chrome.storage.sync.set({
            searchURL: '',
            linkURL: ''
        }, function(items) {
            $('#status').removeClass('text-danger').addClass('text-success').html('重置成功!');
            $('#npmSearchURL').val('');
            $('#npmLinkURL').val('');
        });
    });
});
