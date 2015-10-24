package com.blackfaces.ag.log;

import android.util.Log;

import com.blackfaces.ag.constant.Constant;


/**
 * Created by 183272 on 2015/8/13.
 */
public class Logs {





    public static void v(String tag, String message) {
        if (Constant.LEVEL <= Constant.VERBOSE) {
            Log.v(tag, message);
        }
    }



    public static void d(String tag, String message) {
        if (Constant.LEVEL <= Constant.DEBUG) {
            Log.d(tag, message);
        }
    }


    public static void i(String tag, String message) {
        if (Constant.LEVEL <= Constant.INFO) {
            Log.i(tag, message);
        }
    }


    public static void w(String tag, String message) {
        if (Constant.LEVEL <= Constant.WARN) {
            Log.w(tag, message);
        }
    }

    public static void e(String tag, String message) {
        if (Constant.LEVEL <= Constant.ERROR) {
            Log.e(tag, message);
        }
    }

    /**
     * 获取默认的TAG名称.
     * 比如在MainActivity.java中调用了日志输出.
     * 则TAG为MainActivity
     */
    public static String getDefaultTag(StackTraceElement stackTraceElement) {
        String fileName = stackTraceElement.getFileName();
        String stringArray[] = fileName.split("\\.");
        String tag = stringArray[0];
        return tag;
    }

    /**
     * 输出日志�?��含的信息
     */
    public static String getLogInfo(StackTraceElement stackTraceElement) {
        StringBuilder logInfoStringBuilder = new StringBuilder();
        // 获取线程�?
        String threadName = Thread.currentThread().getName();
        // 获取线程ID
        long threadID = Thread.currentThread().getId();
        // 获取文件�?即xxx.java
        String fileName = stackTraceElement.getFileName();
        // 获取类名.即包�?类名
        String className = stackTraceElement.getClassName();
        // 获取方法名称
        String methodName = stackTraceElement.getMethodName();
        // 获取生日输出行数
        int lineNumber = stackTraceElement.getLineNumber();

        logInfoStringBuilder.append("[ ");
        logInfoStringBuilder.append("threadID=" + threadID).append(Constant.SEPARATOR);
        logInfoStringBuilder.append("threadName=" + threadName).append(Constant.SEPARATOR);
        logInfoStringBuilder.append("fileName=" + fileName).append(Constant.SEPARATOR);
        logInfoStringBuilder.append("className=" + className).append(Constant.SEPARATOR);
        logInfoStringBuilder.append("methodName=" + methodName).append(Constant.SEPARATOR);
        logInfoStringBuilder.append("lineNumber=" + lineNumber);
        logInfoStringBuilder.append(" ] ");
        return logInfoStringBuilder.toString();
    }
}
