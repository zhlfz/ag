package com.blackfaces.ag.ui;

import android.os.Bundle;
import android.os.PersistableBundle;
import android.util.Log;
import android.webkit.WebView;

import com.blackfaces.ag.BaseActivity;
import com.blackfaces.ag.R;

import butterknife.Bind;
import butterknife.ButterKnife;


/**
 * Created by 183272 on 2015/10/22.
 */
public class GeneralWebViewActive extends BaseActivity {
    @Bind(R.id.wvGeneral)
    WebView mWebView;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.webview_general);
        Log.e("************", "----------");
        ButterKnife.bind(this);
        mWebView.loadUrl("file:///android_asset/EVS/fileDetail.html");
//        mWebView.loadUrl("http://www.baidu.com");
    }


}
