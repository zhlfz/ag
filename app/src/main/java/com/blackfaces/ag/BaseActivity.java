package com.blackfaces.ag;

import android.app.Activity;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;

import com.blackfaces.ag.log.Logs;


/**
 * BaseActivity
 *
 */
public class BaseActivity extends Activity {
	public String TAG = this.getClass().getName();
	@Override
	protected void onRestart() {
		Logs.d(TAG, "onRestart()");
		super.onRestart();
	}

	@Override
	protected void onStart() {
		Logs.d(TAG, "onStart()");
		super.onStart();
	}

	@Override
	protected void onResume() {
		Logs.d(TAG, "onResume()");
		super.onResume();
	}

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		Logs.d(TAG, "onCreate()");
		super.onCreate(savedInstanceState);
	}

	@Override
	protected void onPause() {
		Logs.d(TAG, "onPause()");
		super.onPause();
	}

	@Override
	protected void onStop() {
		Logs.d(TAG, "onStop()");
		super.onStop();
	}

	@Override
	protected void onDestroy() {
		Logs.d(TAG, "onDestroy()");
		super.onDestroy();
	}
}
