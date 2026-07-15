def add_features(df):
    df['N_P_K_Sum'] = df['N'] + df['P'] + df['K']
    df['N_P_Ratio'] = df['N'] / (df['P'] + 1e-6)
    df['Temp_Humidity_Interaction'] = df['temperature'] * df['humidity']
    df['Soil_Fertility_Score'] = (df['N'] * 0.4) + (df['P'] * 0.35) + (df['K'] * 0.25)
    return df
